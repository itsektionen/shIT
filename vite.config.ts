import adapter from "@sveltejs/adapter-node";
import devtoolsJson from "vite-plugin-devtools-json";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        tailwindcss(),
        sveltekit({
            compilerOptions: { experimental: { async: true } },
            adapter: adapter(),
            experimental: { remoteFunctions: true },
        }),
        devtoolsJson(),
    ],
});
