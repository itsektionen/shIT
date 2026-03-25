"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vite_plugin_devtools_json_1 = __importDefault(require("vite-plugin-devtools-json"));
var vite_1 = __importDefault(require("@tailwindcss/vite"));
var vite_2 = require("@sveltejs/kit/vite");
var vite_3 = require("vite");
exports.default = (0, vite_3.defineConfig)({ plugins: [(0, vite_1.default)(), (0, vite_2.sveltekit)(), (0, vite_plugin_devtools_json_1.default)()] });
//# sourceMappingURL=vite.config.js.map