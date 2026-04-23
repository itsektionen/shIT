<script lang="ts" module>
    import * as vb from "valibot";
    export const collectionEditSchema = vb.object({
        id: vb.string(),
        label: vb.pipe(vb.string(), vb.trim(), vb.minLength(1)),
        color: vb.optional(vb.string()),
    });
</script>

<script lang="ts">
    import LabelIcon from "@iconify-svelte/material-symbols/text-fields";
    import ColorIcon from "@iconify-svelte/material-symbols/colorize-rounded";

    import ColorSelector from "./ColorSelector.svelte";
    import type { collectionTable } from "$lib/server/db/schema";
    import { deleteCollection, editCollection, getCollections } from "$lib/db.remote";
    import CollectionButton from "./buttons/CollectionButton.svelte";
    import { onMount } from "svelte";

    type Collection = typeof collectionTable.$inferSelect;
    const uid = $props.id();

    let { collection: passedCollection, onclose } = $props<{ collection: Collection; onclose: () => void }>();

    // svelte-ignore state_referenced_locally
    let activeCollection = $state($state.snapshot(passedCollection));
    let openedAt = Date.now();

    onMount(() => {
        editCollection.fields.set({
            id: activeCollection.id,
            label: activeCollection.label,
            color: activeCollection.color ?? undefined,
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
        <div class="border-2 min-w-[16rem] border-b-0 bg-background p-4 shadow-xl">
            <CollectionButton col={activeCollection} onEdit={undefined} />
        </div>
    </div>

    <form
        {...editCollection
            .preflight(collectionEditSchema)
            .enhance(async ({ form, data, submit }) => {
                const active = $state.snapshot(activeCollection);
                form.reset();
                onclose();
                await submit().updates(
                    getCollections().withOverride((cols) =>
                        cols.map((col) => (col.id === active.id ? { ...col, ...data } : col)),
                    ),
                );
            })}
        class={["border-2 bg-background p-4 shadow-xl", "flex flex-col gap-4"]}
    >
        <h2 class="text-xl font-semibold">Edit Collection</h2>

        <input {...editCollection.fields.id.as("hidden", "text")} value={activeCollection.id} />

        <!-- Label field -->
        <div class="flex flex-col gap-1">
            <label for="{uid}-label" class="flex items-center gap-1 font-semibold">
                <LabelIcon class="size-[1lh]" />
                <span>Label</span>
                <span class="text-red-400">*</span>
            </label>
            {#each editCollection.fields.label.issues() as issue, i (i)}
                <span class="text-sm text-red-400">{issue.message}</span>
            {/each}
            <input
                {...editCollection.fields.label.as("text")}
                id="{uid}-label"
                bind:value={
                    () => activeCollection.label,
                    (value) => {
                        activeCollection.label = value;
                    }
                }
                class="w-full"
                autocomplete="off"
                minlength="1"
                pattern=".*\S.*"
                required
            />
        </div>

        <!-- Color field -->
        <div class="flex flex-col gap-1">
            <label for="{uid}-color" class="flex items-center gap-1 font-semibold">
                <ColorIcon class="size-[1lh]" />
                <span class="grow">Color</span>
            </label>
            {#each editCollection.fields.color.issues() as issue, i (i)}
                <span class="text-sm text-red-400">{issue.message}</span>
            {/each}
            <ColorSelector
                id="{uid}-color"
                {...editCollection.fields.color.as("color")}
                bind:color={
                    () => activeCollection.color,
                    (value) => {
                        activeCollection.color = value;
                    }
                }
            />
        </div>

        <!-- Action buttons -->
        <div class="flex justify-end gap-2">
            <button
                type="button"
                class="bg-red-400 px-2 py-1 text-black"
                onclick={() => {
                    deleteCollection(activeCollection.id).updates(getCollections());
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
