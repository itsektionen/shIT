<script lang="ts">
    import LabelIcon from "@iconify-svelte/material-symbols/text-fields";
    import ColorIcon from "@iconify-svelte/material-symbols/colorize-rounded";

    import type { collectionTable } from "$lib/server/db/schema";
    import {
        deleteCollection,
        editCollection as editCollectionForm,
        getCollections,
    } from "$lib/db.remote";
    import { collectionFormSchema } from "$lib/schemas";
    import { onMount } from "svelte";
    import ColorSelector from "../ColorSelector.svelte";
    import CollectionButton from "../buttons/CollectionButton.svelte";

    type Collection = typeof collectionTable.$inferSelect;
    const uid = $props.id();

    let {
        collection: passedCollection,
        onclose,
    }: {
        collection: Collection;
        onclose: () => void;
    } = $props();

    onMount(() => {
        editCollectionForm.fields.set({
            id: passedCollection.id,
            label: passedCollection.label,
            color: passedCollection.color ?? "",
        });
    });
</script>

<dialog
    {@attach (element) => {
        element.showModal();
        return () => element.close();
    }}
    closedby="any"
    onclose={() => onclose()}
    style:width="min(calc(var(--spacing) * 90), 100%)"
    class={[
        "bg-transparent text-foreground select-none",
        "flex flex-col",
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible",
        "backdrop:bg-black/40 backdrop:backdrop-blur-sm",
    ]}
>
    <div class="pointer-events-none flex w-full justify-center" inert>
        <div class="min-w-[16rem] border-2 border-b-0 bg-background p-4 shadow-xl">
            <CollectionButton
                col={{
                    ...passedCollection,
                    ...editCollectionForm.fields.value(),
                }}
                onEdit={undefined}
            />
        </div>
    </div>

    <form
        {...editCollectionForm.preflight(collectionFormSchema).enhance(async ({ data, submit }) => {
            await submit().updates(
                getCollections().withOverride((cols) =>
                    cols.map((col) => (col.id === passedCollection.id ? { ...col, ...data } : col)),
                ),
            );
            onclose();
        })}
        class={["border-2 bg-background p-4 shadow-xl", "flex flex-col gap-4"]}
    >
        <h2 class="text-xl font-semibold">Edit Collection</h2>

        <input {...editCollectionForm.fields.id.as("hidden", passedCollection.id)} />

        <!-- Label field -->
        <div class="flex flex-col gap-1">
            <label for="{uid}-label" class="flex items-center gap-1 font-semibold">
                <LabelIcon class="size-[1lh]" />
                <span>Label</span>
                <span class="text-red-400">*</span>
            </label>
            {#each editCollectionForm.fields.label.issues() as issue, i (i)}
                <span class="text-sm text-red-400">{issue.message}</span>
            {/each}
            <input
                {...editCollectionForm.fields.label.as("text")}
                id="{uid}-label"
                class="w-full"
                autocomplete="off"
                minlength="1"
                pattern=".*\S.*"
                required
            />
        </div>

        <!-- Color field -->
        <div class="flex flex-col gap-1">
            <!-- FIXME: Clicking on the label does not focus the arbitrary color input -->
            <label class="flex items-center gap-1 font-semibold">
                <ColorIcon class="size-[1lh]" />
                <span class="grow">Color</span>
            </label>
            {#each editCollectionForm.fields.color.issues() as issue, i (i)}
                <span class="text-sm text-red-400">{issue.message}</span>
            {/each}
            <ColorSelector field={editCollectionForm.fields.color} />
        </div>

        <!-- Action buttons -->
        <div class="flex justify-end gap-2">
            <button
                type="button"
                class="bg-red-400 px-2 py-1 text-black"
                onclick={() => {
                    deleteCollection(passedCollection.id).updates(getCollections());
                    onclose();
                }}
            >
                Delete
            </button>
            <button
                type="button"
                class="bg-gray-400 px-2 py-1 text-black"
                onclick={() => {
                    onclose();
                }}
            >
                Cancel
            </button>
            <button type="submit" class="bg-green-400 px-2 py-1 text-black"> Save </button>
        </div>
    </form>
</dialog>
