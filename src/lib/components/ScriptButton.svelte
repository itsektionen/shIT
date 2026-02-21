<script lang="ts" module>
    export interface Button {
        uuid: string;
        label: string;
        color?: string;
        iconId?: string;
    }
</script>

<script lang="ts">
    import EditIcon from "@iconify-svelte/material-symbols/edit-rounded";
    import Icon from "@iconify/svelte";
    import { MediaQuery } from "svelte/reactivity";
    import { onLongPress } from "$lib/attachments/longpress";

    let {
        btn,
        onEdit,
    }: {
        btn: Button;
        onEdit: ((btn: Button) => void) | undefined;
    } = $props();

    let touchQuery = new MediaQuery("(pointer: coarse)");
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
        class="size-full truncate overflow-hidden px-4 text-xl font-semibold"
        onclick={() => {
            console.log(`Clicked button ${btn.label}`);
        }}
        // Allow editing via long press on touch devices
        {@attach onLongPress(500, () => onEdit?.(btn))}
    >
        {#if btn.iconId}
            <Icon icon={btn.iconId} class="inline-block size-[1lh]" />
        {/if}
        <span>{btn.label}</span>
    </button>
    {#if onEdit && !touchQuery.current}
        <button
            class="absolute top-0 right-0 size-6 cursor-pointer group-focus-within:visible group-hover:visible sm:invisible"
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
