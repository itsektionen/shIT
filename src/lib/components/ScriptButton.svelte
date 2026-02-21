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
        "group relative flex min-h-16 w-64 items-center justify-center text-wrap",
        "bg-secondary hover:opacity-80 **:focus-visible:opacity-80",
        btn.color && "text-contrast",
    ]}
    style:--bg={btn.color}
    style:background={btn.color}
>
    <button class="size-full truncate overflow-hidden px-4 text-xl font-semibold">
        {#if btn.iconId}
            <Icon icon={btn.iconId} class="inline-block size-[1lh]" />
        {/if}
        <span>{btn.label}</span>
    </button>
    {#if onEdit}
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
