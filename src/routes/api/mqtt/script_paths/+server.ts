import { mqttClient } from "$lib/server/mqtt";
import EventEmitter from "events";
import type { RequestHandler } from "./$types";

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

const scriptPaths = new Set<string>();
const scriptsEmitter = new EventEmitter();

mqttClient.on("message", (topic) => {
    if (!topic.startsWith(TOPIC)) return;
    const scriptName = topic.slice(TOPIC.length);
    if (!scriptPaths.has(scriptName)) {
        scriptPaths.add(scriptName);
        scriptsEmitter.emit("update");
    }
});

export const GET: RequestHandler = ({ request }) => {
    let listener: ((scripts: string[]) => void) | null = null;
    const stream = new ReadableStream({
        start(controller) {
            const sendScripts = () => {
                const scriptsArray = Array.from(scriptPaths);
                controller.enqueue(`data: ${JSON.stringify(scriptsArray)}\n\n`);
            };
            listener = sendScripts;
            scriptsEmitter.on("update", listener);
            sendScripts();
        },
        cancel() {
            if (listener) scriptsEmitter.off("update", listener);
        },
    });
    request.signal.addEventListener("abort", () => {
        if (listener) scriptsEmitter.off("update", listener);
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
};
