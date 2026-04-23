<script lang="ts">
    import EditIcon from "@iconify-svelte/material-symbols/edit-rounded";

    import { resolve } from "$app/paths";
    import type { collectionTable } from "$lib/server/db/schema";

    type Collection = typeof collectionTable.$inferSelect;
    let {
        col,
        isCurrent = false,
        onEdit,
    }: {
        col: Collection;
        isCurrent?: boolean;
        onEdit: ((btn: Collection) => void) | undefined;
    } = $props();
</script>

<div
    class={[
        "group relative h-10 w-full text-wrap select-none hover:opacity-80",
        "flex flex-row items-center justify-center",
        "hover:opacity-80 **:focus-visible:opacity-80 has-[>:first-child:active]:scale-95",
        col.color ? "text-contrast" : "bg-secondary",
        isCurrent && "outline-2 outline-offset-2 outline-brand",
    ]}
    style:--bg={col.color}
    style:background={col.color}
>
    <a
        class="flex size-full shrink cursor-pointer items-center truncate overflow-hidden px-2 text-xl font-semibold"
        href={resolve(isCurrent ? "/" : `/col/${col.id}`)}
        tabindex="0"
    >
        <span>{col.label}</span>
    </a>
    {#if onEdit}
        <button
            class={[
                "not-pointer-coarse:absolute not-pointer-coarse:top-0 not-pointer-coarse:right-0",
                "cursor-pointer pointer-coarse:size-10",
                "flex shrink-0 items-center justify-center",
                "not-pointer-coarse:opacity-0 group-focus-within:opacity-100 group-hover:opacity-100",
            ]}
            title="Edit collection"
            onclick={() => onEdit?.(col)}
        >
            <EditIcon class="size-6 pointer-coarse:size-8" />
        </button>
    {/if}
</div>
