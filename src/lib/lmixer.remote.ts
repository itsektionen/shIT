import { command } from "$app/server";
import * as vb from "valibot";
import { mqttClient } from "./server/mqtt";

export const runScript = command(vb.string(), async (scriptPath) => {
    if (!mqttClient.connected) {
        console.error("MQTT client is not connected. Cannot run scripts.");
        return;
    }
    console.log("Running script:", scriptPath);
    if (import.meta.env.DEV) {
        console.warn("Running in development mode. Will not execute script.");
    } else {
        mqttClient.publish("light_mixer/code/startScript", scriptPath);
    }
});
