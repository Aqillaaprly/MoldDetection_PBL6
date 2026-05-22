#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>
#include <ESP32Servo.h>
#include <WiFi.h>
#include <HTTPClient.h>

// ================= KONFIGURASI PIN =================
#define DHTPIN 13
#define DHTTYPE DHT22

#define I2C_SDA 26
#define I2C_SCL 27

#define LDR_PIN 34
#define RELAY_PIN 16
#define SERVO_PIN 18

#define LED_MERAH 4
#define LED_KUNING 2
#define LED_HIJAU 15

// ================= KONFIGURASI WiFi =================
const char* ssid = "Wokwi-GUEST";
const char* password = "";

// GANTI SESUAI IP WIFI LAPTOP
const char* serverUrl = "http://192.168.111.100:3000/api/sensors";

const char* deviceId = "mold_esp32_01";

const unsigned long SEND_INTERVAL = 10000;

unsigned long lastSendTime = 0;

DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);
Servo myServo;

const int LDR_THRESHOLD = 2000;

void setup() {
  Serial.begin(115200);

  Wire.begin(I2C_SDA, I2C_SCL);

  lcd.init();
  lcd.backlight();

  dht.begin();

  pinMode(RELAY_PIN, OUTPUT);
  pinMode(LED_MERAH, OUTPUT);
  pinMode(LED_KUNING, OUTPUT);
  pinMode(LED_HIJAU, OUTPUT);

  myServo.attach(SERVO_PIN);
  myServo.write(0);

  digitalWrite(RELAY_PIN, LOW);

  matikanSemuaLED();

  connectToWiFi();

  lcd.setCursor(0, 0);
  lcd.print("Sistem Deteksi");

  lcd.setCursor(0, 1);
  lcd.print("Jamur Aktif");

  delay(2000);
  lcd.clear();
}

void loop() {

  // Auto reconnect WiFi
  if (WiFi.status() != WL_CONNECTED) {
    connectToWiFi();
  }

  float humi = dht.readHumidity();
  float temp = dht.readTemperature();

  int ldrValue = analogRead(LDR_PIN);

  bool isTerang = ldrValue > LDR_THRESHOLD;

  if (isnan(humi) || isnan(temp)) {
    Serial.println("Gagal membaca DHT");

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Sensor Error");

    delay(2000);
    return;
  }

  // ================= DEBUG SERIAL =================
  Serial.print("Temp: ");
  Serial.print(temp);
  Serial.print(" C | ");

  Serial.print("Humidity: ");
  Serial.print(humi);
  Serial.print("% | ");

  Serial.print("LDR: ");
  Serial.print(ldrValue);

  Serial.println(isTerang ? " (Terang)" : " (Gelap)");

  // ================= LOGIKA =================

  matikanSemuaLED();

  // BAHAYA
  if (humi > 71.0 && !isTerang) {

    digitalWrite(LED_MERAH, HIGH);

    digitalWrite(RELAY_PIN, HIGH);

    myServo.write(90);

    tampilkanLCD(temp, humi, "BAHAYA");
  }

  // WASPADA
  else if (humi > 60.0 && isTerang) {

    digitalWrite(LED_KUNING, HIGH);

    digitalWrite(RELAY_PIN, LOW);

    myServo.write(0);

    tampilkanLCD(temp, humi, "WASPADA");
  }

  // AMAN
  else {

    digitalWrite(LED_HIJAU, HIGH);

    digitalWrite(RELAY_PIN, LOW);

    myServo.write(0);

    tampilkanLCD(temp, humi, "AMAN");
  }

  // ================= KIRIM DATA =================

  if (millis() - lastSendTime >= SEND_INTERVAL) {

    if (WiFi.status() == WL_CONNECTED) {
      kirimDataKeServer(temp, humi, ldrValue);
    }

    lastSendTime = millis();
  }

  delay(2000);
}

// ================= LCD =================

void tampilkanLCD(float t, float h, String statusMsg) {

  lcd.clear();

  lcd.setCursor(0, 0);
  lcd.print("RH:");
  lcd.print((int)h);
  lcd.print("% ");

  lcd.print("T:");
  lcd.print((int)t);
  lcd.print("C");

  lcd.setCursor(0, 1);
  lcd.print(statusMsg);
}

// ================= LED =================

void matikanSemuaLED() {

  digitalWrite(LED_MERAH, LOW);
  digitalWrite(LED_KUNING, LOW);
  digitalWrite(LED_HIJAU, LOW);
}

// ================= WIFI =================

void connectToWiFi() {

  Serial.println("\n=== CONNECT WIFI ===");

  lcd.clear();

  lcd.setCursor(0, 0);
  lcd.print("Connecting WiFi");

  WiFi.mode(WIFI_STA);

  WiFi.begin(ssid, password);

  int attempts = 0;

  while (WiFi.status() != WL_CONNECTED && attempts < 20) {

    delay(500);

    Serial.print(".");

    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {

    Serial.println("\nWiFi Connected");

    Serial.print("IP: ");
    Serial.println(WiFi.localIP());

    lcd.clear();

    lcd.setCursor(0, 0);
    lcd.print("WiFi Connected");

    delay(1500);
  }

  else {

    Serial.println("\nWiFi Failed");

    lcd.clear();

    lcd.setCursor(0, 0);
    lcd.print("WiFi Failed");

    delay(1500);
  }

  lcd.clear();
}

// ================= HTTP POST =================

void kirimDataKeServer(float temp, float humi, int ldr) {

  if (!isnan(temp) && !isnan(humi)) {

    HTTPClient http;

    http.setTimeout(5000);

    String payload = "{";

    payload += "\"deviceId\":\"" + String(deviceId) + "\",";
    payload += "\"temperature\":" + String(temp, 2) + ",";
    payload += "\"humidity\":" + String(humi, 2) + ",";
    payload += "\"light\":" + String(ldr);

    payload += "}";

    Serial.println("\nSending:");
    Serial.println(payload);

    http.begin(serverUrl);

    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.POST(payload);

    if (httpResponseCode > 0) {

      String response = http.getString();

      Serial.print("Response: ");
      Serial.println(httpResponseCode);

      Serial.println(response);

      digitalWrite(LED_HIJAU, HIGH);
      delay(100);
      digitalWrite(LED_HIJAU, LOW);
    }

    else {

      Serial.print("HTTP Error: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  }

  else {

    Serial.println("Invalid Sensor Data");
  }
}