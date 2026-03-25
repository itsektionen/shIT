"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var drizzle_kit_1 = require("drizzle-kit");
if (!process.env.DATABASE_URL)
    throw new Error("DATABASE_URL is not set");
exports.default = (0, drizzle_kit_1.defineConfig)({
    schema: "./src/lib/server/db/schema.ts",
    dialect: "sqlite",
    dbCredentials: { url: process.env.DATABASE_URL },
    verbose: true,
    strict: true,
    casing: "snake_case",
});
//# sourceMappingURL=drizzle.config.js.map