// Processing real-time data from gateway devices (optional example)
const mqtt = require('mqtt');

let client;

function connectMQTT() {
  const url = process.env.MQTT_URL;
  if (!url) {
    console.log('MQTT_URL is not defined, MQTT service was not started.');
    return null;
  }
  client = mqtt.connect(url);

  client.on('connect', () => {
    console.log('MQTT connected');
    const topic = process.env.MQTT_TOPIC || 'gateways/+/status';
    client.subscribe(topic, (err) => {
      if (err) console.error('MQTT subscribe error:', err.message);
    });
  });

  client.on('message', (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());
      // TODO: process payload into the Gateway model
      console.log('MQTT message:', topic, payload);
    } catch (e) {
      console.error('MQTT message parse error:', e.message);
    }
  });

  client.on('error', (err) => console.error('MQTT error:', err.message));
  return client;
}

module.exports = { connectMQTT };
