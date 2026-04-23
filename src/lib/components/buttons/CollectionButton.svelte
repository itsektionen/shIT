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
        onclick={(event) => {
            if (editMode.isEditing) {
                event.preventDefault();
                onEdit?.(col);
            }
        }}
    >
        <span>{col.label}</span>
    </a>
    {#if onEdit && editMode.isEditing}
        <div
            class={[
                "pointer-events-none absolute top-0 right-0 flex h-6 min-w-6 items-center",
                "not-pointer-coarse:opacity-0 group-hover:opacity-100",
            ]}
        >
            <EditIcon class="size-6" />
        </div>
    {/if}
</div>
