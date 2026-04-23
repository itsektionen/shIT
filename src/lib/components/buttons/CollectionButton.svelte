<script lang="ts">
    import EditIcon from "@iconify-svelte/material-symbols/edit-rounded";

    import { resolve } from "$app/paths";
    import type { collectionTable } from "$lib/server/db/schema";
    import { getEditModeContext } from "$lib/context";

    type Collection = typeof collectionTable.$inferSelect;
    let {
        col,
        isCurrent = false,
        onEdit,
    }: {
        col: Collection;
        isCurrent?: boolean;
        onEdit: ((col: Collection) => void) | undefined;
    } = $props();

    let editMode = getEditModeContext();
</script>

<div
    class={[
        "group relative h-10 w-full text-wrap select-none hover:opacity-80",
        "flex flex-row items-center justify-center",
        "bg-secondary hover:opacity-80 **:focus-visible:opacity-80 has-[>:first-child:active]:scale-95",
        col.color && "text-contrast",
        isCurrent && "outline-2 outline-offset-2 outline-brand",
    ]}
    style:--bg={col.color || undefined}
    style:background={col.color || undefined}
>
    <a
        class="flex size-full shrink cursor-pointer items-center truncate overflow-hidden px-2 text-xl font-semibold"
        href={resolve(isCurrent ? "/" : `/col/${col.id}`)}
    >
        <span>{col.label}</span>
    </a>
    {#if onEdit && editMode.isEditing}
        <button
            class={[
                "h-10 w-10 shrink-0 pointer-coarse:w-15",
                "flex flex-row items-center justify-end pr-2",
                "hover:bg-background/50 hover:text-brand",
            ]}
            onclick={() => {
                if (editMode.isEditing) {
                    onEdit?.(col);
                }
            }}
        >
            <EditIcon class="size-6" />
        </button>
    {/if}
</div>
