/*
 * ============================================================
 * Smart Bin IoT - ESP32 + HC-SR04 + WiFi
 * ============================================================
 * Hardware:
 *   - ESP32 DevKit (ESP32-WROOM-32)
 *   - HC-SR04 Ultrasonic Sensor
 *   - (Opsional) LED indikator status: hijau, kuning, merah
 *   - (Opsional) LCD I2C 16x2
 *
 * Wiring:
 *   HC-SR04 VCC  -> ESP32 5V (VIN)
 *   HC-SR04 GND  -> ESP32 GND
 *   HC-SR04 TRIG -> ESP32 GPIO 5
 *   HC-SR04 ECHO -> ESP32 GPIO 18  (lewat voltage divider 1k+2k ke 3.3V)
 *
 *   LED hijau    -> GPIO 25 (via resistor 220Ω ke GND)
 *   LED kuning   -> GPIO 26
 *   LED merah    -> GPIO 27
 *
 *   LCD I2C SDA  -> GPIO 21
 *   LCD I2C SCL  -> GPIO 22
 *
 * Library yang dibutuhkan (Library Manager Arduino IDE):
 *   - WiFi (built-in ESP32)
 *   - HTTPClient (built-in ESP32)
 *   - ArduinoJson by Benoit Blanchon
 *   - LiquidCrystal_I2C by Frank de Brabander  (opsional)
 * ============================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <LiquidCrystal_I2C.h>

// ============ KONFIGURASI — UBAH SESUAI PUNYAMU ============
const char* WIFI_SSID     = "KOS EL FATA 1";
const char* WIFI_PASSWORD = "bismillahdulu";

// Dapat dari dashboard /admin -> Devices -> copy api_key
const char* API_KEY  = "adb5359c1318e6312734e235e55d909afc1c8a26873a2c8f";
// Dapat dari dashboard /admin -> Bins -> bin_code (mis: "BIN-001")
const char* BIN_CODE = "BIN-001";

// Endpoint Supabase Cloud (ingest-reading)
const char* INGEST_URL =
  "https://bnbzwrrbaghgggtxzmfb.supabase.co/functions/v1/ingest-reading";

// Interval kirim data ke server (millidetik)
unsigned long currentIntervalMs = 30000UL;   // Default awal 30 detik

// ============ PIN ============
#define PIN_TRIG    5
#define PIN_ECHO    18
#define LED_GREEN   25
#define LED_YELLOW  26
#define LED_RED     27

LiquidCrystal_I2C lcd(0x27, 16, 2);

// ============ STATE ============
unsigned long lastSendMs = 0;

// ============ HELPERS ============
float readDistanceCm() {
  // Trigger pulse 10us
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);

  // Echo, timeout 30ms (~5m)
  long duration = pulseIn(PIN_ECHO, HIGH, 30000UL);
  if (duration == 0) return -1.0f;            // timeout / out-of-range

  // Kecepatan suara 0.0343 cm/us, dibagi 2 (pulang-pergi)
  float distance = (duration * 0.0343f) / 2.0f;
  return distance;
}

float readDistanceAveraged(int samples = 5) {
  float sum = 0;
  int valid = 0;
  for (int i = 0; i < samples; i++) {
    float d = readDistanceCm();
    if (d > 0 && d < 400) { sum += d; valid++; }
    delay(60);
  }
  if (valid == 0) return -1.0f;
  return sum / valid;
}

void setStatusLed(int fillPct) {
  digitalWrite(LED_GREEN,  fillPct < 70 ? HIGH : LOW);
  digitalWrite(LED_YELLOW, (fillPct >= 70 && fillPct < 90) ? HIGH : LOW);
  digitalWrite(LED_RED,    fillPct >= 90 ? HIGH : LOW);
}

void connectWiFi() {
  Serial.printf("[WiFi] Connecting to %s ", WIFI_SSID);
  WiFi.disconnect(true);  // Hapus cache WiFi sebelumnya (Penting untuk iPhone)
  delay(1000);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 20000UL) {
    delay(500); Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("\n[WiFi] Connected. IP=%s\n", WiFi.localIP().toString().c_str());
  } else {
    Serial.println("\n[WiFi] FAILED — will retry on next loop.");
  }
}

bool sendReading(float distanceCm) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[HTTP] WiFi not connected, skip");
    return false;
  }

  WiFiClientSecure client;
  client.setInsecure();   // skip certificate validation (untuk testing)

  HTTPClient http;
  http.setTimeout(10000);
  if (!http.begin(client, INGEST_URL)) {
    Serial.println("[HTTP] begin() failed");
    return false;
  }

  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-api-key", API_KEY);

  JsonDocument doc;
  doc["bin_code"]    = BIN_CODE;
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
      setStatusLed(fillPct);
      Serial.printf("[OK] fill=%d%%\n", fillPct);

      // --- UPDATE LCD ---
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Jarak: ");
      lcd.print(distanceCm, 1);
      lcd.print(" cm");
      
      lcd.setCursor(0,1);
      lcd.print("Isi: ");
      lcd.print(fillPct);
      lcd.print("% ");
      if (fillPct < 70) lcd.print("(Aman)");
      else if (fillPct < 90) lcd.print("(Siaga)");
      else lcd.print("(Penuh)");

      // --- SMART INTERVAL LOGIC ---
      if (fillPct < 50) {
        currentIntervalMs = 120000UL; // 2 menit jika kosong
      } else if (fillPct < 80) {
        currentIntervalMs = 60000UL;  // 1 menit jika sedang
      } else {
        currentIntervalMs = 10000UL;  // 10 detik jika hampir penuh
      }
      Serial.printf("[INFO] Smart Interval aktif: %lu ms\n", currentIntervalMs);
    }
  }

  http.end();
  return ok;
}

// ============ SETUP / LOOP ============
void setup() {
  Serial.begin(115200);
  delay(300);
  Serial.println("\n=== Smart Bin ESP32 (WiFi) ===");

  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_YELLOW, OUTPUT);
  pinMode(LED_RED, OUTPUT);

  lcd.init(); 
  lcd.backlight();
  lcd.setCursor(0,0); 
  lcd.print("EcoPhora System");
  lcd.setCursor(0,1);
  lcd.print("Connecting WiFi..");

  connectWiFi();
  lastSendMs = millis() - currentIntervalMs;   // langsung kirim di loop pertama
}

void loop() {
  // Reconnect WiFi kalau putus
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
    delay(2000);
    return;
  }

  if (millis() - lastSendMs >= currentIntervalMs) {
    lastSendMs = millis();

    float d = readDistanceAveraged(5);
    if (d <= 0) {
      // --- SENSOR FALLBACK / SIMULATION MODE ---
      Serial.println("[SENSOR] Sensor HC-SR04 tidak terdeteksi!");
      Serial.println("[MOCK] Mengaktifkan Mode Simulasi Otomatis (Uji Coba Sebelum Dirangkai)...");
      
      // Simulasikan tong sampah yang terisi perlahan (tinggi awal 50 cm, berkurang 5 cm per siklus)
      static float simulatedDistance = 50.0f;
      simulatedDistance -= 5.0f;
      if (simulatedDistance < 5.0f) {
        simulatedDistance = 50.0f; // Reset kembali ke kosong jika sudah penuh
      }
      d = simulatedDistance;
    }

    Serial.printf("[SENSOR] distance = %.1f cm\n", d);
    sendReading(d);
  }

  delay(100);
}
