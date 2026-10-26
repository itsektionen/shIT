import { getRequestEvent, query } from "$app/server";
import { mqttClient } from "./server/mqtt";
import { scriptPaths, scriptsEmitter } from "./server/scripts";

// resolves when mqtt/script state changes
const nextChange = (signal: AbortSignal) =>
    new Promise<void>((resolve) => {
        if (signal.aborted) return resolve();
        const onChange = () => {
            scriptsEmitter.off("update", onChange);
            mqttClient.off("connect", onChange);
            mqttClient.off("close", onChange);
            signal.removeEventListener("abort", onChange);
            resolve();
        };
        scriptsEmitter.on("update", onChange);
        mqttClient.on("connect", onChange);
        mqttClient.on("close", onChange);
        signal.addEventListener("abort", onChange);
    });

const snapshot = () => ({
    paths: Array.from(scriptPaths),
    connected: mqttClient.connected,
});

export const getScriptPaths = query.live(async function* () {
    const { signal } = getRequestEvent().request;
    yield snapshot();
    while (!signal.aborted) {
        await nextChange(signal);
        if (signal.aborted) return;
        yield snapshot();
    }
});
