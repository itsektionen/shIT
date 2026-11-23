import mqtt from "mqtt";
import { MQTT_PASSWORD, MQTT_URL, MQTT_USERNAME } from "$app/env/private";

export const mqttClient = mqtt.connect(MQTT_URL, {
    username: MQTT_USERNAME || undefined,
    password: MQTT_PASSWORD || undefined,
});

mqttClient.on("connect", () => {
    console.log("Successfully connected to MQTT broker at", MQTT_URL);
});
mqttClient.on("error", (err) => {
    console.error("MQTT client error:", err);
});
