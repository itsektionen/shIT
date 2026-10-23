import { scriptPaths, scriptsEmitter } from "$lib/server/scripts";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = ({ request }) => {
    let listener: (() => void) | null = null;
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
