
'use strict';

var config = require('./config.json');

var debug = require('debug')('Faker');
var mqtt = require('mqtt')

// Define influx.


var mqttClient  = mqtt.connect(config.host, {
  port: config.port,
  clean: false,
  clientId: config.clientId,
  username: config.username,
  password: config.password
});

mqttClient.on('connect', function (connack) {  
  if (connack.sessionPresent) {
    debug('Already subbed, no subbing necessary');
  } 
  else {
    debug('First session! Subbing.');
    
    mqttClient.subscribe('#', { qos: 2 });
  }
});

mqttClient.on('message', function (topic, message) {

})

for (var i in config.sensors) {
  var sensor = config.sensors[i];

  // Send messages with the configured interval.
  setInterval(sendMessage, sensor.interval * 1000, sensor.topic + '/pressure', 1005, 1008);
  setInterval(sendMessage, sensor.interval * 1000, sensor.topic + '/temperature', 19.0, 23.0);
  setInterval(sendMessage, sensor.interval * 1000, sensor.topic + '/humidity', 30.0, 32.0);
  setInterval(sendMessage, sensor.interval * 1000, sensor.topic + '/lux', 10, 15);
}

/**
 * Send message with random flot between low and high.
 * 
 * @param {string} topic.
 * @param {float} low
 * @param {float} high
 */
function sendMessage(topic, low, high) {
  let message = random(low, high);
  debug(topic + ' - ' + message);

  mqttClient.publish(topic, String(message));
}

/**
 * Generate random flot between low and high.
 * 
 * @param {float} low
 * @param {float} high
 */
function random (low, high) {
  let val = Math.random() * (high - low) + low;
  val = val.toFixed(2);
  return val;
}
