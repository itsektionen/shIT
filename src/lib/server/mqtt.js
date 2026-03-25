"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mqttClient = void 0;
var mqtt_1 = __importDefault(require("mqtt"));
var private_1 = require("$env/dynamic/private");
if (!private_1.env.MQTT_URL)
    throw new Error("MQTT_URL is not set");
exports.mqttClient = mqtt_1.default.connect(private_1.env.MQTT_URL);
exports.mqttClient.on("connect", function () {
    console.log("Successfully connected to MQTT broker at", private_1.env.MQTT_URL);
});
exports.mqttClient.on("error", function (err) {
    console.error("MQTT client error:", err);
});
//# sourceMappingURL=mqtt.js.map