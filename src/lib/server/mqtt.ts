import mqtt from "mqtt";
import { MQTT_URL } from "$app/env/private";

export const mqttClient = mqtt.connect(MQTT_URL);

mqttClient.on("connect", () => {
    console.log("Successfully connected to MQTT broker at", MQTT_URL);
});
mqttClient.on("error", (err) => {
    console.error("MQTT client error:", err);
});
