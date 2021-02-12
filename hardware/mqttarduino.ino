#include <WiFi.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>
#include <sstream>


#define MQTT_VERSION MQTT_VERSION_3_1
// Update these with values suitable for your network.
const char* ssid = "Redmi";
const char* password = "00000000";
const char* mqtt_server = "keepmesafe.xyz";
#define mqtt_port 8883 
#define MQTT_USER "mqttubuntu"
#define MQTT_PASSWORD "123456789"
#define MQTT_SERIAL_PUBLISH_CH "MQ-7"
#define MQTT_SERIAL_PUBLISH_CH1 "MQ-5"
#define MQTT_SERIAL_RECEIVER_CH "testtopic"
WiFiClientSecure wifiClient;

PubSubClient client(wifiClient);

void setup_wifi() {
    delay(10);
    // We start by connecting to a WiFi network
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
      WiFi.begin(ssid, password);
      delay(1000);
      Serial.println(".");
    }
    randomSeed(micros());
    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "mqttubuntu";
    // Attempt to connect
    if (client.connect(clientId.c_str(),MQTT_USER,MQTT_PASSWORD)) {
      Serial.println("connected");
      client.subscribe(MQTT_SERIAL_RECEIVER_CH);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void callback(char* topic, byte *payload, unsigned int length) {
    Serial.println("-------new message from brooker-----");
    Serial.print("channel:");
    Serial.println(topic);
    Serial.print("data:");  
    Serial.write(payload, length);
    Serial.println();
}

void setup() {
  Serial.begin(115200);
  Serial.setTimeout(500);// Set time out for 
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  reconnect();
}

void publishSerialData(char *serialData){
  if (!client.connected()) {
    reconnect();
  }
  client.publish(MQTT_SERIAL_PUBLISH_CH, serialData);
}
void loop() {
   client.loop();
   delay(1000);
   int sensor=A0;
   int gas_value;
   gas_value=analogRead(sensor)*100 + random(99);

   client.publish(MQTT_SERIAL_PUBLISH_CH, gas_value.str().c_str());
   Serial.println("ok");
   delay(2000);
   
   
 }
