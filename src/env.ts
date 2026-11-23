import { defineEnvVars } from "@sveltejs/kit/env";
import * as vb from "valibot";

export const variables = defineEnvVars({
    MQTT_URL: { schema: vb.pipe(vb.string(), vb.url()) },
    MQTT_USERNAME: { schema: vb.optional(vb.string()) },
    MQTT_PASSWORD: { schema: vb.optional(vb.string()) },
    DATABASE_URL: { schema: vb.pipe(vb.string(), vb.url()) },
});
