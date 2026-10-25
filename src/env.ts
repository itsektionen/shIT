import { defineEnvVars } from "@sveltejs/kit/env";
import * as vb from "valibot";

export const variables = defineEnvVars({
    MQTT_URL: { schema: vb.pipe(vb.string(), vb.url()) },
    DATABASE_URL: { schema: vb.pipe(vb.string(), vb.url()) },
});
