<script lang="ts">
    import EditIcon from "@iconify-svelte/material-symbols/edit-rounded";
    import WarnIcon from "@iconify-svelte/material-symbols/warning-rounded";

    import Icon from "@iconify/svelte";
    import type { buttonTable } from "$lib/server/db/schema";
    import { runScript } from "$lib/lmixer.remote";
    import { confirmScriptExecution, getScriptsContext, getEditModeContext } from "$lib/context";

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
</script>

<div
    class={[
        "group relative min-h-16 w-64 text-wrap select-none",
        "flex flex-row items-center justify-center",
        "bg-secondary hover:opacity-80 **:focus-visible:opacity-80 has-[>:first-child:active]:scale-95",
        btn.color && "text-contrast",
    ]}
    style:--bg={btn.color}
    style:background={btn.color}
>
    <button
        class="size-full cursor-pointer truncate overflow-hidden px-4 text-xl font-semibold"
        onclick={() => {
            if (editMode.isEditing) {
                onEdit?.(btn);
            } else {
                if (confirmScriptExecution(btn.label)) {
                    runScript(btn.script);
                }
            }
        }}
    >
        {#if btn.iconId}
            <Icon icon={btn.iconId} class="inline-block size-[1.5lh]" />
        {/if}
        <span>{btn.label}</span>
    </button>
    {#if onEdit || isInvalidScript}
        <button
            class={[
                "absolute top-0 right-0 flex h-6 min-w-6 cursor-pointer items-center",
                isInvalidScript
                    ? ""
                    : "not-pointer-coarse:opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 pointer-coarse:hidden",
            ]}
            title={isInvalidScript ? "Script not found" : "Edit button"}
            onclick={() => onEdit?.(btn)}
        >
            {#if isInvalidScript}
                <WarnIcon class="size-6" />
            {:else}
                <EditIcon class="size-6" />
            {/if}
        </button>
    {/if}
</div>
