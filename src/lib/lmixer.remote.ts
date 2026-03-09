import { command } from "$app/server";
import * as vb from "valibot";

export const runScript = command(vb.string(), async (scriptPath) => {
    // TODO: Write next SMN monday when I am actually in kistan
    console.log("Running script:", scriptPath);
});
