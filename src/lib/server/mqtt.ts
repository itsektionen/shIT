import mqtt from "mqtt";
import { env } from "$env/dynamic/private";

if (!env.MQTT_URL) throw new Error("MQTT_URL is not set");
export const mqttClient = mqtt.connect(env.MQTT_URL);

mqttClient.on("connect", () => {
    console.log("Successfully connected to MQTT broker at", env.MQTT_URL);
});
