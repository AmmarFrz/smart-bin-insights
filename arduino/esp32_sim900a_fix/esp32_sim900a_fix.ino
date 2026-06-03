/*
 * ============================================================
 * Smart Bin IoT - ESP32 + HC-SR04 + WiFi (Captive Portal Setup)
 * ============================================================
 * Fitur:
 *   - WiFi nirkabel untuk transmisi data.
 *   - Captive Portal AP ("SmartBin-Setup") untuk konfigurasi nirkabel via HP.
 *   - Menyimpan SSID WiFi, Password WiFi, Bin Code, dan API Key di flash (Preferences).
 *   - Reset Pabrik jika tombol BOOT (GPIO 0) ditekan selama 3 detik.
 * ============================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <Preferences.h>
#include <WebServer.h>
#include <DNSServer.h>
#include <LiquidCrystal_I2C.h>

// Konfigurasi Server Supabase
const char SERVER_HOST[] = "bnbzwrrbaghgggtxzmfb.supabase.co";
const char INGEST_URL[]  = "https://bnbzwrrbaghgggtxzmfb.supabase.co/functions/v1/ingest-reading";

// State Konfigurasi dari Flash
String savedSsid;
String savedPass;
String savedApiKey;
String savedBinCode;

// Interval kirim data ke server (millidetik)
unsigned long currentIntervalMs = 30000UL;   // Default 30 detik

#define PIN_TRIG    5
#define PIN_ECHO    18

LiquidCrystal_I2C lcd(0x27, 16, 2);
Preferences prefs;

unsigned long lastSendMs = 0;
unsigned long bootButtonTime = 0;

// --- Variabel Layar LCD ---
float globalDist = -1.0f;
int globalFill = 0;
unsigned long lastLcdChangeMs = 0;
int lcdFrame = 0;

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

void connectWiFi() {
  Serial.printf("[WiFi] Connecting to %s ", savedSsid.c_str());
  
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("WiFi Connecting");
  lcd.setCursor(0,1);
  lcd.print(savedSsid.substring(0, 16));

  WiFi.disconnect(true);
  delay(1000);
  WiFi.mode(WIFI_STA);
  WiFi.begin(savedSsid.c_str(), savedPass.c_str());

  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 20000UL) {
    delay(500); Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("\n[WiFi] Connected. IP=%s\n", WiFi.localIP().toString().c_str());
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("WiFi Connected!");
    lcd.setCursor(0,1);
    lcd.print(WiFi.localIP().toString());
    delay(2000);
  } else {
    Serial.println("\n[WiFi] FAILED — will retry on next loop.");
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("WiFi Conn Failed");
    lcd.setCursor(0,1);
    lcd.print("Will retry...");
    delay(2000);
  }
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
<p style="font-size:13px;text-align:center;color:#666;">Silakan konfigurasi WiFi dan Kunci API alat.</p>
<form action="/save" method="POST">
<label><b>WiFi SSID (Nama WiFi):</b></label>
<input type="text" name="ssid" placeholder="WiFi SSID" required>
<label><b>WiFi Password:</b></label>
<input type="password" name="pass" placeholder="Password WiFi">
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
  
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("SETUP MODE ACTIVE");
  lcd.setCursor(0,1);
  lcd.print("AP:SmartBin-Setup");

  WiFi.mode(WIFI_AP);
  WiFi.softAP("SmartBin-Setup");

  DNSServer dnsServer;
  dnsServer.start(53, "*", WiFi.softAPIP());

  WebServer server(80);
  server.on("/", [&]() {
    server.send(200, "text/html", configHtml);
  });

  server.on("/save", HTTP_POST, [&]() {
    String ssid = server.arg("ssid");
    String pass = server.arg("pass");
    String bc = server.arg("bincode");
    String ak = server.arg("apikey");
    ssid.trim(); pass.trim(); bc.trim(); ak.trim();
    
    if(ssid.length() > 0 && bc.length() > 0 && ak.length() > 0) {
      prefs.begin("smartbin", false);
      prefs.putString("ssid", ssid);
      prefs.putString("pass", pass);
      prefs.putString("bincode", bc);
      prefs.putString("apikey", ak);
      prefs.end();
      server.send(200, "text/html", "<h2 style='font-family:sans-serif;text-align:center;margin-top:50px;'>Berhasil! 🎉<br>Alat sedang memuat ulang profil...</h2>");
      delay(3000);
      ESP.restart();
    } else {
      server.send(400, "text/plain", "Data WiFi, Bin Code, dan API Key tidak boleh kosong.");
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
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[HTTP] WiFi not connected, skip");
    return false;
  }

  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient http;
  http.setTimeout(10000);
  if (!http.begin(client, INGEST_URL)) {
    Serial.println("[HTTP] begin() failed");
    return false;
  }

  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-api-key", savedApiKey);

  JsonDocument doc;
  doc["bin_code"]    = savedBinCode;
  doc["distance_cm"] = distanceCm;

  String payload;
  serializeJson(doc, payload);

  Serial.printf("[HTTP] POST %s\n", payload.c_str());
  int code = http.POST(payload);
  String resp = http.getString();
  Serial.printf("[HTTP] -> %d : %s\n", code, resp.c_str());

  bool ok = (code == 200);

  if (ok) {
    JsonDocument rdoc;
    DeserializationError error = deserializeJson(rdoc, resp);
    if (!error) {
      int fillPct = rdoc["fill_percentage"] | 0;
      Serial.printf("[OK] fill=%d%%\n", fillPct);

      // --- SIMPAN DATA UNTUK LCD ---
      globalFill = fillPct;
      globalDist = distanceCm;

      // --- SMART INTERVAL LOGIC ---
      if (fillPct < 50) {
        currentIntervalMs = 120000UL;
      } else if (fillPct < 80) {
        currentIntervalMs = 60000UL;
      } else {
        currentIntervalMs = 10000UL;
      }
      Serial.printf("[INFO] Smart Interval aktif: %lu ms\n", currentIntervalMs);
    }
  }

  http.end();
  return ok;
}

void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println("\n=== Smart Bin ESP32 (WiFi + Captive Portal) ===");

  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  pinMode(0, INPUT_PULLUP); // Tombol BOOT untuk factory reset

  lcd.init(); 
  lcd.backlight();
  lcd.setCursor(0,0); 
  lcd.print("EcoPhora System");
  lcd.setCursor(0,1);
  lcd.print("Booting...");
  delay(1500);

  prefs.begin("smartbin", true);
  savedSsid = prefs.getString("ssid", "");
  savedPass = prefs.getString("pass", "");
  savedApiKey = prefs.getString("apikey", "");
  savedBinCode = prefs.getString("bincode", "");
  prefs.end();

  // Jika belum dikonfigurasi, langsung buka Captive Portal
  if (savedSsid == "" || savedApiKey == "" || savedBinCode == "") {
    startConfigPortal();
  }

  Serial.printf("Config Loaded: SSID=%s, Bin=%s\n", savedSsid.c_str(), savedBinCode.c_str());
  connectWiFi();
  lastSendMs = millis() - currentIntervalMs;
}

void loop() {
  // Reconnect WiFi jika putus
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
    delay(2000);
    return;
  }

  if (millis() - lastSendMs >= currentIntervalMs) {
    lastSendMs = millis();
    float d = readDistanceAveraged(5);
    if (d <= 0) {
      // MOCK simulasi jika sensor dicabut
      static float simulatedDistance = 15.0f;
      simulatedDistance -= 1.5f;
      if (simulatedDistance < 2.0f) simulatedDistance = 15.0f;
      d = simulatedDistance;
    }
    Serial.printf("[SENSOR] %.1f cm\n", d);
    sendReading(d);
  }

  // Cek tombol BOOT untuk Reset Pabrik (tekan 3 detik)
  if (digitalRead(0) == LOW) {
    if (bootButtonTime == 0) bootButtonTime = millis();
    if (millis() - bootButtonTime > 3000) {
      Serial.println("FACTORY RESET TRIGGERED!");
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("FACTORY RESET");
      lcd.setCursor(0,1);
      lcd.print("Clearing Flash..");
      prefs.begin("smartbin", false);
      prefs.clear();
      prefs.end();
      delay(2000);
      ESP.restart();
    }
  } else {
    bootButtonTime = 0;
  }

  // --- LOGIKA CAROUSEL LCD ---
  if (WiFi.status() == WL_CONNECTED && globalDist >= 0) {
    if (millis() - lastLcdChangeMs >= 4000) {
      lastLcdChangeMs = millis();
      lcd.clear();
      if (lcdFrame == 0) {
        // Layar 1: Kapasitas & Status
        lcd.setCursor(0, 0);
        lcd.print(savedBinCode);
        lcd.print(" | ");
        lcd.print(globalFill);
        lcd.print("%");
        
        lcd.setCursor(0, 1);
        if (globalFill < 70) lcd.print("Status: AMAN");
        else if (globalFill < 90) lcd.print("Status: SIAGA");
        else lcd.print("Status: PENUH");
      } else {
        // Layar 2: Jaringan & Jarak Fisik
        lcd.setCursor(0, 0);
        lcd.print("IP:");
        lcd.print(WiFi.localIP().toString());
        
        lcd.setCursor(0, 1);
        lcd.print("Jarak: ");
        lcd.print(globalDist, 1);
        lcd.print(" cm");
      }
      lcdFrame = (lcdFrame + 1) % 2;
    }
  }

  delay(100);
}
