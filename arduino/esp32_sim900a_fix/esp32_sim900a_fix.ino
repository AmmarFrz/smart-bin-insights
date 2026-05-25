/*
 * ============================================================
 * Smart Bin IoT - ESP32 + HC-SR04 + SIM900A (GPRS)
 * ============================================================
 */
#define TINY_GSM_MODEM_SIM900
#define TINY_GSM_RX_BUFFER 1024

#include <TinyGsmClient.h>
#include <ArduinoHttpClient.h>
#include <ArduinoJson.h>
#include <Preferences.h>
#include <WiFi.h>
#include <WebServer.h>
#include <DNSServer.h>

const char* APN      = "internet";
const char* APN_USER = "";
const char* APN_PASS = "";

String savedApiKey;
String savedBinCode;

const char SERVER_HOST[] = "bnbzwrrbaghgggtxzmfb.supabase.co";
const int  SERVER_PORT   = 80;
const char SERVER_PATH[] = "/functions/v1/ingest-reading";

const unsigned long SEND_INTERVAL_MS = 60000UL;

#define PIN_TRIG    5
#define PIN_ECHO    18
#define LED_GREEN   25
#define LED_YELLOW  26
#define LED_RED     27

#define MODEM_RX    16
#define MODEM_TX    17
#define MODEM_BAUD  115200

// Gunakan pointer untuk mencegah C++ Static Initialization Crash
TinyGsm*       modem;
TinyGsmClient* gsmClient;
HttpClient*    http;
Preferences*   prefs;

unsigned long lastSendMs = 0;
int lastFillPct = -1;
unsigned long bootButtonTime = 0;

float readDistanceCm() {
  digitalWrite(PIN_TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);
  long duration = pulseIn(PIN_ECHO, HIGH, 30000UL);
  if (duration == 0) return -1.0f;
  return (duration * 0.0343f) / 2.0f;
}

float readDistanceAveraged(int samples = 5) {
  float sum = 0; int valid = 0;
  for (int i = 0; i < samples; i++) {
    float d = readDistanceCm();
    if (d > 0 && d < 400) { sum += d; valid++; }
    delay(60);
  }
  return valid == 0 ? -1.0f : sum / valid;
}

void setStatusLed(int fillPct) {
  digitalWrite(LED_GREEN,  fillPct < 70 ? HIGH : LOW);
  digitalWrite(LED_YELLOW, (fillPct >= 70 && fillPct < 90) ? HIGH : LOW);
  digitalWrite(LED_RED,    fillPct >= 90 ? HIGH : LOW);
}

bool initModem() {
  Serial.println("[GSM] Init modem...");
  Serial2.begin(MODEM_BAUD, SERIAL_8N1, MODEM_RX, MODEM_TX);
  delay(3000);

  if (!modem->restart()) {
    Serial.println("[GSM] restart failed");
    return false;
  }
  Serial.printf("[GSM] Modem: %s\n", modem->getModemInfo().c_str());

  Serial.println("[GSM] Cari sinyal...");
  if (!modem->waitForNetwork(60000L)) {
    Serial.println("[GSM] network failed");
    return false;
  }
  Serial.println("[GSM] network OK");

  Serial.printf("[GPRS] Connecting APN=%s ...\n", APN);
  if (!modem->gprsConnect(APN, APN_USER, APN_PASS)) {
    Serial.println("[GPRS] connect failed");
    return false;
  }
  Serial.printf("[GPRS] OK. IP=%s\n", modem->localIP().toString().c_str());
  delay(1500);
  return true;
}

const char* configHtml = R"HTML(
<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Smart Bin Setup</title>
<style>body{font-family:sans-serif;padding:20px;max-width:400px;margin:auto;background:#f4f4f9;color:#333;}
h2{text-align:center;color:#0056b3;}
.card{background:#fff;padding:20px;border-radius:10px;box-shadow:0 4px 6px rgba(0,0,0,0.1);}
input{width:100%;padding:10px;margin:8px 0 20px 0;box-sizing:border-box;border:1px solid #ccc;border-radius:5px;}
button{width:100%;padding:15px;background:#0056b3;color:white;border:none;border-radius:5px;font-size:16px;font-weight:bold;cursor:pointer;}</style>
</head><body>
<div class="card">
<h2>⚙️ Smart Bin Setup</h2>
<p style="font-size:13px;text-align:center;color:#666;">Silakan masukkan data alat dari Dashboard Admin.</p>
<form action="/save" method="POST">
<label><b>Bin Code</b> (contoh: BIN-001):</label>
<input type="text" name="bincode" placeholder="BIN-001" required>
<label><b>Device API Key:</b></label>
<input type="text" name="apikey" placeholder="sbk_abc123..." required>
<button type="submit">Simpan & Mulai 🚀</button>
</form>
</div>
</body></html>
)HTML";

void startConfigPortal() {
  Serial.println("[SETUP] Buka WiFi HP Anda, gabung ke SmartBin-Setup");
  WiFi.mode(WIFI_AP);
  WiFi.softAP("SmartBin-Setup");

  DNSServer dnsServer;
  dnsServer.start(53, "*", WiFi.softAPIP());

  WebServer server(80);
  server.on("/", [&]() {
    server.send(200, "text/html", configHtml);
  });

  server.on("/save", HTTP_POST, [&]() {
    String bc = server.arg("bincode");
    String ak = server.arg("apikey");
    bc.trim(); ak.trim();
    
    if(bc.length() > 0 && ak.length() > 0) {
      prefs->begin("smartbin", false);
      prefs->putString("bincode", bc);
      prefs->putString("apikey", ak);
      prefs->end();
      server.send(200, "text/html", "<h2 style='font-family:sans-serif;text-align:center;margin-top:50px;'>Berhasil! 🎉<br>Alat akan direstart...</h2>");
      delay(3000);
      ESP.restart();
    } else {
      server.send(400, "text/plain", "Data tidak boleh kosong.");
    }
  });

  server.onNotFound([&]() {
    server.sendHeader("Location", "http://192.168.4.1/", true);
    server.send(302, "text/plain", "");
  });

  server.begin();

  while(true) {
    dnsServer.processNextRequest();
    server.handleClient();
    delay(10);
  }
}

bool sendReading(float distanceCm) {
  if (!modem->isGprsConnected()) {
    Serial.println("[GPRS] not connected, reconnecting...");
    if (!initModem()) return false;
  }

  JsonDocument doc;
  doc["bin_code"]    = savedBinCode;
  doc["distance_cm"] = distanceCm;
  String payload;
  serializeJson(doc, payload);

  Serial.printf("[HTTP] POST %s\n", payload.c_str());

  http->beginRequest();
  int err = http->post(SERVER_PATH);
  if (err != 0) {
    Serial.printf("[HTTP] post err=%d\n", err);
    http->endRequest();
    return false;
  }
  http->sendHeader("Content-Type", "application/json");
  http->sendHeader("x-api-key", savedApiKey);
  http->sendHeader("Content-Length", payload.length());
  http->beginBody();
  http->print(payload);
  http->endRequest();

  int status = http->responseStatusCode();
  String resp = http->responseBody();
  Serial.printf("[HTTP] -> %d : %s\n", status, resp.c_str());

  if (status == 200) {
    JsonDocument rdoc;
    DeserializationError error = deserializeJson(rdoc, resp);
    if (!error) {
      int fillPct = rdoc["fill_percentage"] | 0;
      lastFillPct = fillPct;
      setStatusLed(fillPct);
    }
    return true;
  }
  return false;
}

void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println("\n=== Smart Bin ESP32 (SIM900A GPRS) ===");

  modem = new TinyGsm(Serial2);
  gsmClient = new TinyGsmClient(*modem);
  http = new HttpClient(*gsmClient, SERVER_HOST, SERVER_PORT);
  prefs = new Preferences();

  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_YELLOW, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(0, INPUT_PULLUP);

  prefs->begin("smartbin", true);
  savedApiKey = prefs->getString("apikey", "");
  savedBinCode = prefs->getString("bincode", "");
  prefs->end();

  if (savedApiKey == "" || savedBinCode == "") {
    startConfigPortal();
  }

  Serial.printf("Config Loaded: Bin=%s\n", savedBinCode.c_str());
  initModem();
  lastSendMs = millis() - SEND_INTERVAL_MS;
}

void loop() {
  if (millis() - lastSendMs >= SEND_INTERVAL_MS) {
    lastSendMs = millis();
    float d = readDistanceAveraged(5);
    if (d <= 0) {
      Serial.println("[SENSOR] failed");
      return;
    }
    Serial.printf("[SENSOR] %.1f cm\n", d);
    sendReading(d);
  }

  if (digitalRead(0) == LOW) {
    if (bootButtonTime == 0) bootButtonTime = millis();
    if (millis() - bootButtonTime > 3000) {
      Serial.println("FACTORY RESET TRIGGERED!");
      prefs->begin("smartbin", false);
      prefs->clear();
      prefs->end();
      delay(2000);
      ESP.restart();
    }
  } else {
    bootButtonTime = 0;
  }
  delay(100);
}
