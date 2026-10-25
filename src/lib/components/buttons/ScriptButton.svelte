<script lang="ts">
    import PlayIcon from "@iconify-svelte/material-symbols/play-arrow-rounded";
    import EditIcon from "@iconify-svelte/material-symbols/edit-rounded";
    import WarnIcon from "@iconify-svelte/material-symbols/warning-rounded";
    import SpinnerIcon from "@iconify-svelte/material-symbols/progress-activity";
    import DoneIcon from "@iconify-svelte/material-symbols/check-rounded";
    import FailIcon from "@iconify-svelte/material-symbols/error-rounded";

    import Icon from "@iconify/svelte";
    import type { buttonTable } from "#lib/server/db/schema.js";
    import { runScript } from "#lib/lmixer.remote.js";
    import { confirmScriptExecution, getScriptsContext, getEditModeContext } from "#lib/context.js";

    type Button = typeof buttonTable.$inferSelect;
    let {
        btn,
        onEdit,
    }: {
        btn: Button;
        onEdit: ((btn: Button) => void) | undefined;
    } = $props();

    let scripts = getScriptsContext();
    let isInvalidScript = $derived(scripts.paths && !scripts.paths.includes(btn.script));

    let editMode = getEditModeContext();

    let runState = $state<"idle" | "running" | "done" | "failed">("idle");
    let runError = $state("");
    let resetTimeout: ReturnType<typeof setTimeout>;
    async function run() {
        clearTimeout(resetTimeout);
        runState = "running";
        try {
            await runScript(btn.script);
            runState = "done";
        } catch (error) {
            runState = "failed";
            runError = error instanceof Error ? error.message : "Failed to run";
        }
        resetTimeout = setTimeout(() => (runState = "idle"), 3000);
    }
</script>

<div
    class={[
        "group relative min-h-16 w-64 text-wrap select-none",
        "flex flex-row items-center justify-center",
        "bg-secondary hover:opacity-80 **:focus-visible:opacity-80 has-[>:first-child:active]:scale-95",
        btn.color && "text-contrast",
    ]}
    style:--bg={btn.color || undefined}
    style:background={btn.color || undefined}
    title={runState === "failed"
        ? runError
        : `Script: "${btn.script}"${isInvalidScript ? " (not found)" : ""}`}
>
    <button
        class="size-full cursor-pointer truncate overflow-hidden px-4 text-xl font-semibold"
        onclick={() => {
            if (editMode.isEditing || isInvalidScript) {
                onEdit?.(btn);
            } else {
                if (confirmScriptExecution(btn.label)) {
                    run();
                }
            }
        }}
    >
        {#if btn.iconId}
            <Icon icon={btn.iconId} class="inline-block size-[1.5lh]" />
        {/if}
        <span>{btn.label}</span>
    </button>
    <div
        class={[
            "pointer-events-none absolute top-0 right-0 flex h-6 min-w-6 items-center",
            runState === "idle" &&
                !isInvalidScript &&
                "not-pointer-coarse:opacity-0 group-focus-within:opacity-100 group-hover:opacity-100",
        ]}
    >
        {#if runState === "running"}
            <SpinnerIcon class="size-6 animate-spin" />
        {:else if runState === "done"}
            <DoneIcon class="size-6" />
        {:else if runState === "failed"}
            <FailIcon class="size-6" />
        {:else if isInvalidScript}
            <WarnIcon class="size-6" />
        {:else if editMode.isEditing}
            <EditIcon class="size-6" />
        {:else}
            <PlayIcon class="size-6" />
        {/if}
    </div>
    <span class="sr-only" role="status">
        {#if runState === "done"}
            Script started
        {:else if runState === "failed"}
            {runError}
        {/if}
    </span>
</div>
