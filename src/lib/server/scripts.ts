import EventEmitter from "events";
import { mqttClient } from "./mqtt";

const TOPIC = "light_mixer/code/scripts/";

const subscribe = () => {
    const subPath = TOPIC + "#";
    mqttClient.subscribe(subPath, (err) => {
        if (err) console.error("Failed to subscribe to MQTT topic:", err);
        else console.log("Subscribed to MQTT topic: " + subPath);
    });
};
if (mqttClient.connected) subscribe();
mqttClient.on("connect", subscribe);

export const scriptPaths = new Set<string>();
export const scriptsEmitter = new EventEmitter<{ update: [] }>();

mqttClient.on("message", (topic, payload) => {
    if (!topic.startsWith(TOPIC)) return;
    const scriptName = topic.slice(TOPIC.length);
    // Empty payload means the retained message was cleared
    if (payload.length === 0) {
        if (scriptPaths.delete(scriptName)) scriptsEmitter.emit("update");
    } else if (!scriptPaths.has(scriptName)) {
        scriptPaths.add(scriptName);
        scriptsEmitter.emit("update");
    }
});

export const isKnownScript = (path: string) => scriptPaths.has(path);
