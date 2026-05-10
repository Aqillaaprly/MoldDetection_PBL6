/**
 * Wokwi Constants & Configuration
 */

export const WOKWI_CONFIG = {
  // Device Configuration
  DEVICE_ID: 'wokwi_esp32_01',
  DEVICE_TYPE: 'ESP32',
  
  // Sensor Configuration
  SENSORS: {
    DHT22: {
      name: 'Temperature & Humidity',
      pin: 13,
      type: 'DHT22',
    },
    LIGHT_SENSOR: {
      name: 'Light Intensity',
      pin: 34,
      type: 'Photoresistor',
      range: [0, 1000], // lux
    },
    RELAY: {
      name: 'Relay Module',
      pin: 12,
      type: 'Relay',
    },
    LED: {
      name: 'WiFi Status LED',
      pin: 2,
      type: 'LED',
    },
  },

  // Data Transmission
  SEND_INTERVAL: 10000, // milliseconds (10 seconds)
  
  // Thresholds for Automation
  THRESHOLDS: {
    HUMIDITY_HIGH: 75, // % - trigger relay/alert
    TEMPERATURE_LOW: 20, // °C
    TEMPERATURE_HIGH: 30, // °C
    LIGHT_LOW: 100, // lux
    LIGHT_HIGH: 700, // lux
  },

  // API Configuration (will be set at runtime)
  API_ENDPOINT: 'http://192.168.x.x:3000/api/sensors',
  
  // WiFi Configuration
  WiFi: {
    SSID: 'Wokwi-GUEST',
    PASSWORD: '',
  },

  // Status Check
  ONLINE_TIMEOUT: 30000, // 30 seconds - device considered offline if no data
  POLLING_INTERVAL: 5000, // 5 seconds - frontend polling interval
}

// Sensor value ranges for validation
export const SENSOR_RANGES = {
  temperature: { min: 0, max: 50 },
  humidity: { min: 0, max: 100 },
  light: { min: 0, max: 1000 },
}

// Status colors for UI
export const STATUS_COLORS = {
  online: { bg: 'bg-green-900/30', text: 'text-green-400', label: 'Online' },
  offline: { bg: 'bg-red-900/30', text: 'text-red-400', label: 'Offline' },
  warning: { bg: 'bg-yellow-900/30', text: 'text-yellow-400', label: 'Warning' },
}
