import { command } from "$app/server";
import * as vb from "valibot";
import { error } from "@sveltejs/kit";
import { mqttClient } from "./server/mqtt";
import { isKnownScript } from "./server/scripts";

export const runScript = command(vb.string(), async (scriptPath) => {
    if (!mqttClient.connected) {
        console.error("MQTT client is not connected. Cannot run scripts.");
        error(503, "LMixer is not connected");
    }
    if (!isKnownScript(scriptPath)) error(400, "Unknown script");
    console.log("Running script:", scriptPath);
    if (import.meta.env.DEV) {
        console.warn("Running in development mode. Will not execute script.");
    } else {
        mqttClient.publish("light_mixer/code/startScript", scriptPath);
    }
});
