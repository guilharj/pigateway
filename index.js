var awsIot = require('aws-iot-device-sdk');

//
// Replace the values of '<YourUniqueClientIdentifier>' and '<YourAWSRegion>'
// with a unique client identifier and the AWS region you created your
// certificate in (e.g. 'us-east-1').  NOTE: client identifiers must be
// unique within your AWS account; if a client attempts to connect with a
// client identifier which is already in use, the existing connection will
// be terminated.
//


var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://18.111.118.234',{password:"iotclass",username:"esp8266"})
console.log("STARTING")

client.on('connect', function () {
  client.subscribe('/test/out')
})
console.log("AFTER CLIENT ON")

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
})
console.log("AFTER CLIENT ON MESSAGE")



 var thingShadows = awsIot.thingShadow({
   keyPath: "./760922e3f5-private.pem.key",
  certPath: "./760922e3f5-certificate.pem.crt",
    caPath: "./VeriSign-Class 3-Public-Primary-Certification-Authority-G5.pem",
  clientId: "thing123456789098765",
    region: "us-east-1"
});

console.log("AFTER CLIENT SHADOW")


var device = awsIot.device({
      keyPath: "./760922e3f5-private.pem.key",
  certPath: "./760922e3f5-certificate.pem.crt",
    caPath: "./VeriSign-Class 3-Public-Primary-Certification-Authority-G5.pem",
  clientId: "thing123456789098765",
    region: "us-east-1"
});

//
// Device is an instance returned by mqtt.Client(), see mqtt.js for full
// documentation.
//
device
  .on('connect', function() {
    console.log('connect');
    device.subscribe('thing');
    device.publish('thing', JSON.stringify({ test_data: 1}));
    });

device
  .on('message', function(topic, payload) {
    console.log('message', topic, payload.toString());
  });

//
// Client token value returned from thingShadows.update() operation
//
var clientTokenUpdate;


thingShadows.on('connect', function() {
//
// After connecting to the AWS IoT platform, register interest in the
// Thing Shadow named 'RGBLedLamp'.
//
    thingShadows.register( 'thing', function() {
        console.log("##### REGISTERED INTEREST")

    });

thingShadows.on('status', 
    function(thingName, stat, clientToken, stateObject) {
       console.log('received '+stat+' on '+thingName+': '+
                   JSON.stringify(stateObject));
//
// These events report the status of update(), get(), and delete() 
// calls.  The clientToken value associated with the event will have
// the same value which was returned in an earlier call to get(),
// update(), or delete().  Use status events to keep track of the
// status of shadow operations.
//
    });

 thingShadows.on('delta', 
    function(thingName, stateObject) {
        client.publish('/text/out', 'BUTTON_PRESSED')

       console.log('received delta on '+thingName+': '+
                   JSON.stringify(stateObject));
    });
});
console.log("AFTER CLIENT THINGS")
