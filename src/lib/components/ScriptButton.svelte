<script lang="ts">
    import EditIcon from "@iconify-svelte/material-symbols/edit-rounded";
    import Icon from "@iconify/svelte";
    import { onLongPress } from "$lib/attachments/longpress";
    import type { buttonTable } from "$lib/server/db/schema";
    import { runScript } from "$lib/lmixer.remote";

    type Button = typeof buttonTable.$inferSelect;

    let {
        btn,
        onEdit,
    }: {
        btn: Button;
        onEdit: ((btn: Button) => void) | undefined;
    } = $props();
</script>

<div
    class={[
        "group relative flex min-h-16 w-64 items-center justify-center text-wrap select-none",
        "bg-secondary hover:opacity-80 **:focus-visible:opacity-80 has-[>:first-child:active]:scale-95",
        btn.color && "text-contrast",
    ]}
    style:--bg={btn.color}
    style:background={btn.color}
>
    <button
        class="size-full cursor-pointer truncate overflow-hidden px-4 text-xl font-semibold"
        onclick={() => {
            runScript(btn.script);
        }}
        // Allow editing via long press on touch devices
        {@attach onLongPress(500, () => onEdit?.(btn))}
        oncontextmenu={(event) => event.preventDefault()}
    >
        {#if btn.iconId}
            <Icon icon={btn.iconId} class="inline-block size-[1.5lh]" />
        {/if}
        <span>{btn.label}</span>
    </button>
    {#if onEdit}
        <button
            class="absolute top-0 right-0 size-6 cursor-pointer group-focus-within:opacity-100 group-hover:opacity-100 sm:opacity-0 pointer-coarse:hidden"
            title="Edit button"
            onclick={() => onEdit?.(btn)}
        >
            <EditIcon />
        </button>
    {/if}
</div>

<style>
    .text-contrast {
        color: contrast-color(var(--bg));
        /* Not yet widely supported :/ as of writing (Feb. 2026) */
        @supports not (color: contrast-color(red)) {
            color: hwb(
                from oklch(from var(--bg) l 0 0) h calc(((b - 50) * 999)) calc(((w - 50) * 999))
            );
        }
    }
</style>
