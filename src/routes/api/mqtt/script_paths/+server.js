"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
var mqtt_1 = require("$lib/server/mqtt");
var events_1 = __importDefault(require("events"));
var TOPIC = "light_mixer/code/scripts/";
var subscribe = function () {
    var subPath = TOPIC + "#";
    mqtt_1.mqttClient.subscribe(subPath, function (err) {
        if (err)
            console.error("Failed to subscribe to MQTT topic:", err);
        else
            console.log("Subscribed to MQTT topic: " + subPath);
    });
};
if (mqtt_1.mqttClient.connected)
    subscribe();
mqtt_1.mqttClient.on("connect", subscribe);
var scriptPaths = new Set();
var scriptsEmitter = new events_1.default();
mqtt_1.mqttClient.on("message", function (topic) {
    if (!topic.startsWith(TOPIC))
        return;
    var scriptName = topic.slice(TOPIC.length);
    if (!scriptPaths.has(scriptName)) {
        scriptPaths.add(scriptName);
        scriptsEmitter.emit("update");
    }
});
var GET = function (_a) {
    var request = _a.request;
    var listener = null;
    var stream = new ReadableStream({
        start: function (controller) {
            var sendScripts = function () {
                var scriptsArray = Array.from(scriptPaths);
                controller.enqueue("data: ".concat(JSON.stringify(scriptsArray), "\n\n"));
            };
            listener = sendScripts;
            scriptsEmitter.on("update", listener);
            sendScripts();
        },
        cancel: function () {
            if (listener)
                scriptsEmitter.off("update", listener);
        },
    });
    request.signal.addEventListener("abort", function () {
        if (listener)
            scriptsEmitter.off("update", listener);
    });
    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
};
exports.GET = GET;
//# sourceMappingURL=+server.js.map