// Gateway cihazlarından gelen gerçek zamanlı verileri işleme (opsiyonel örnek)
const mqtt = require('mqtt');

let client;

function connectMQTT() {
  const url = process.env.MQTT_URL;
  if (!url) {
    console.log('MQTT_URL tanımlı değil, MQTT servisi başlatılmadı.');
    return null;
  }
  client = mqtt.connect(url);

  client.on('connect', () => {
    console.log('MQTT bağlandı');
    const topic = process.env.MQTT_TOPIC || 'gateways/+/status';
    client.subscribe(topic, (err) => {
      if (err) console.error('MQTT subscribe hatası:', err.message);
    });
  });

  client.on('message', (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());
      // TODO: payload'ı Gateway modeline işle
      console.log('MQTT mesajı:', topic, payload);
    } catch (e) {
      console.error('MQTT mesaj parse hatası:', e.message);
    }
  });

  client.on('error', (err) => console.error('MQTT hata:', err.message));
  return client;
}

module.exports = { connectMQTT };
