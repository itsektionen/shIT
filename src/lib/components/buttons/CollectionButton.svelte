<script lang="ts">
    import EditIcon from "~icons/material-symbols/edit-rounded";

    import { resolve } from "$app/paths";
    import type { collectionTable } from "#lib/server/db/schema.js";
    import { getEditModeContext } from "#lib/context.js";

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
    class={["group relative h-10 w-full text-wrap select-none", col.color && "text-contrast"]}
    style:--bg={col.color || undefined}
>
    <a
        class={[
            "tile-button flex size-full cursor-pointer items-center truncate overflow-hidden px-2",
            "bg-secondary text-xl font-semibold",
            "group-hover:opacity-80 focus-visible:opacity-80 active:scale-95",
            isCurrent && "outline-2 outline-offset-2 outline-brand",
            // The edit button sits over the end of the tile.
            onEdit && editMode.isEditing && "pr-10 pointer-coarse:pr-15",
        ]}
        style:background={col.color || undefined}
        href={isCurrent
            ? resolve("/(app)")
            : resolve("/(app)/col/[collection]", { collection: col.id })}
    >
        <span>{col.label}</span>
    </a>
    {#if onEdit && editMode.isEditing}
        <button
            class={[
                "absolute inset-y-0 right-0 w-10 pointer-coarse:w-15",
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
