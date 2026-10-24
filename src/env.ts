import { defineEnvVars } from "@sveltejs/kit/env";

export const variables = defineEnvVars({
    MQTT_URL: { schema: (input) => input ?? "" },
    DATABASE_URL: { schema: (input) => input ?? "" },
});
