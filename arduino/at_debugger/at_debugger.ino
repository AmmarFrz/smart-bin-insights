// ============================================================
// SIM900A AUTO-BAUD RATE SWEEPER & DIAGNOSTIC DEBUGGER (V3 - PIN FIX)
// ============================================================
// Menggunakan Pin D13 dan D14 untuk menghindari crash PSRAM pada ESP32!

#define ESP_RX_PIN  16 // Hubungkan ke 3VT (TX SIM900A) -> PIN RX2 (16) ESP32
#define ESP_TX_PIN  17 // Hubungkan ke 3VR (RX SIM900A) -> PIN TX2 (17) ESP32

long bauds[] = {9600, 19200, 38400, 57600, 115200};
int numBauds = 5;

void setup() {
  Serial.begin(115200);
  delay(2000);
  
  Serial.println("\n===============================================");
  Serial.println("   SIM900A AUTOMATIC BAUD RATE SWEEPER (V3)   ");
  Serial.println("===============================================");
  Serial.println("[SOLUSI] Jalur komunikasi dipindah ke Pin D13 & D14!");
  Serial.println("===============================================\n");
  
  bool detected = false;
  
  for (int i = 0; i < numBauds; i++) {
    long activeBaud = bauds[i];
    Serial.printf("[TEST] Menguji kecepatan %ld bps... ", activeBaud);
    
    // Mulai Serial2 pada pin baru D13 dan D14
    Serial2.begin(activeBaud, SERIAL_8N1, ESP_RX_PIN, ESP_TX_PIN);
    delay(300);
    
    // Bersihkan buffer sisa secara aman
    int cleanCount = 0;
    while(Serial2.available() && cleanCount < 50) {
      Serial2.read();
      cleanCount++;
    }
    
    bool gotReply = false;
    
    // Kirim perintah AT sebanyak 3 kali
    for (int j = 0; j < 3; j++) {
      Serial2.println("AT");
      delay(150); 
      
      if (Serial2.available()) {
        String response = Serial2.readString();
        response.trim();
        if (response.length() > 0) {
          Serial.println("\n\n-----------------------------------------------");
          Serial.printf(" 🎉 BERHASIL MENEMUKAN KONEKSI!\n");
          Serial.printf(" Kecepatan SIM900A Anda: %ld bps\n", activeBaud);
          Serial.printf(" Respon Modem: %s\n", response.c_str());
          Serial.println("-----------------------------------------------\n");
          detected = true;
          gotReply = true;
          break;
        }
      }
    }
    
    if (gotReply) {
      break;
    } else {
      Serial.println("Tidak merespon.");
    }
    
    // Tutup Serial2 sebelum menguji yang berikutnya
    Serial2.end();
    delay(300);
  }
  
  if (!detected) {
    Serial.println("\n===============================================");
    Serial.println("[INFO] Pemindaian selesai. Belum mendeteksi modem.");
    Serial.println("Jika semua status di atas 'Tidak merespon', silakan periksa:");
    Serial.println("1. Kabel jumper RX dan TX: Apakah sudah terpasang di D13 dan D14?");
    Serial.println("2. Kabel VCCmcu: Apakah sudah terhubung ke 3V3 ESP32?");
    Serial.println("3. Kabel GND: Apakah GND ESP32 sudah menyatu dengan GND SIM900A?");
    Serial.println("===============================================");
  }
  
  Serial.println("\nMemulai mode Pass-Through manual (9600 bps)...");
  Serial2.begin(9600, SERIAL_8N1, ESP_RX_PIN, ESP_TX_PIN);
}

void loop() {
  while (Serial.available()) {
    Serial2.write(Serial.read());
  }
  while (Serial2.available()) {
    Serial.write(Serial2.read());
  }
}
