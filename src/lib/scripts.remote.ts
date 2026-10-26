import { getRequestEvent, query } from "$app/server";
import { scriptPaths, scriptsEmitter } from "./server/scripts";

// resolves when mqtt/script state changes
const nextChange = (signal: AbortSignal) =>
    new Promise<void>((resolve) => {
        if (signal.aborted) return resolve();

        const onChange = () => {
            scriptsEmitter.off("update", onChange);
            signal.removeEventListener("abort", onChange);
            resolve();
        };
        scriptsEmitter.on("update", onChange);
        signal.addEventListener("abort", onChange);
    });

export const getScriptPaths = query.live(async function* () {
    const { signal } = getRequestEvent().request;

    yield Array.from(scriptPaths);

    while (!signal.aborted) {
        await nextChange(signal);
        if (signal.aborted) return;
        yield Array.from(scriptPaths);
    }
});
