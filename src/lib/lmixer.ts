export async function getScripts(): Promise<string[]> {
    return ["src/test.txt", "meow.lua"];
}

export async function runScript(script: string): Promise<void> {
    // Totally real computations yes yes
    console.log("Running script:", script);
}
