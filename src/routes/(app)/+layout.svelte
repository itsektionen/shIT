<script lang="ts">
    import type { LayoutProps } from "./$types";
    import fuzzysort from "fuzzysort";
    import { resolve } from "$app/paths";
    import Sortable from "sortablejs";
    import type { Attachment } from "svelte/attachments";

    import Sidebar from "#lib/components/Sidebar.svelte";
    import SidebarToggleButton from "#lib/components/SidebarToggleButton.svelte";
    import ScriptTree from "#lib/components/ScriptTree.svelte";
    import CollectionButton from "#lib/components/buttons/CollectionButton.svelte";
    import CollectionEditModal from "#lib/components/modals/CollectionEditModal.svelte";

    import AddIcon from "~icons/material-symbols/add-2-rounded";
    import { createCollection, getCollections, reorderCollections } from "#lib/db.remote.js";
    import { createCollectionSchema } from "#lib/schemas.js";
    import { onMount } from "svelte";
    import {
        getScriptsContext,
        setCollectionContext,
        setEditModeContext,
        setScriptsContext,
    } from "#lib/context.js";
    import TitleBar from "#lib/components/TitleBar.svelte";

    import type { collectionTable } from "#lib/server/db/schema.js";

    type Collection = typeof collectionTable.$inferSelect;

    let editMode = $state({
        isEditing: false,
    });
    setEditModeContext(editMode);

    let { data, params, children }: LayoutProps = $props();

    let collectionCtx = $state<ReturnType<typeof setCollectionContext>>({ current: undefined });
    $effect(() => {
        collectionCtx.current = data.currentCollection;
    });
    setCollectionContext(collectionCtx);

    let scripts = $state<ReturnType<typeof setScriptsContext>>({ paths: undefined });
    setScriptsContext(scripts);
    onMount(() => {
        const eventSource = new EventSource(resolve("api/mqtt/script_paths"));
        eventSource.onmessage = (event) => {
            scripts.paths = JSON.parse(event.data);
        };
        return () => {
            eventSource.close();
        };
    });

    let collectionQuery = $state("");
    let scriptQuery = $state("");

    let searchedPaths: string[] = $derived.by(() => {
        const paths = getScriptsContext().paths ?? [];
        return scriptQuery
            ? fuzzysort.go(scriptQuery, paths).map((result) => result.target)
            : paths;
    });

    let leftSidebar: Sidebar;
    let rightSidebar: Sidebar;
    let editingCollection = $state<Collection | undefined>(undefined);

    const sortable: Attachment<HTMLElement> = (element) => {
        const sortable = Sortable.create(element, {
            animation: 100,
            async onEnd(event) {
                if (
                    event.from !== event.to ||
                    event.oldIndex === undefined ||
                    event.newIndex === undefined
                )
                    return;

                const collections = await getCollections();
                const [moved] = collections.splice(event.oldIndex, 1);
                collections.splice(event.newIndex, 0, moved);
                reorderCollections(collections.map((c) => c.id)).updates(
                    getCollections().withOverride((cols) =>
                        cols.sort((a, b) => {
                            const aIndex = collections.findIndex((i) => i.id === a.id);
                            const bIndex = collections.findIndex((i) => i.id === b.id);
                            return aIndex - bIndex;
                        }),
                    ),
                );
            },
        });
        return () => sortable.destroy();
    };
</script>

{#if editingCollection}
    <CollectionEditModal
        collection={editingCollection}
        onclose={() => {
            editingCollection = undefined;
        }}
    />
{/if}

<div class="flex h-full flex-row justify-center">
    <Sidebar side="left" bind:this={leftSidebar}>
        {#snippet toolbar()}
            <input
                bind:value={collectionQuery}
                type="search"
                name="collection-search"
                aria-label="Search collections"
                placeholder="Search"
                class="h-7 min-w-0 grow"
            />
        {/snippet}

        <div class="flex w-full flex-col gap-2">
            <ul
                class="flex w-full flex-col gap-2"
                aria-label="Collections"
                {@attach editMode.isEditing && !collectionQuery ? sortable : undefined}
            >
                {#each collectionQuery ? fuzzysort
                          .go(collectionQuery, await getCollections(), { key: "label" })
                          .map((r) => r.obj) : await getCollections() as collection (collection.id)}
                    {@const isCurrent = collection.id === params.collection}
                    <li>
                        <CollectionButton
                            col={collection}
                            {isCurrent}
                            onEdit={() => {
                                editingCollection = collection;
                            }}
                        />
                    </li>
                {/each}
            </ul>
            <div>
                <form class="relative" {...createCollection.preflight(createCollectionSchema)}>
                    <input
                        {...createCollection.fields.label.as("text")}
                        placeholder="Create new collection"
                        required
                        pattern=".*\S.*"
                        class="peer min-h-12 w-full text-center placeholder:sr-only placeholder:opacity-0"
                        autocomplete="off"
                    />
                    <!-- Custom placeholder with icon -->
                    <div
                        aria-hidden="true"
                        class={[
                            "hidden peer-placeholder-shown:flex peer-focus-within:hidden",
                            "pointer-events-none absolute inset-0 items-center justify-center gap-2 opacity-60",
                        ]}
                    >
                        <AddIcon class="size-[1lh]" />
                        <span>New collection</span>
                    </div>
                </form>
            </div>
        </div>
    </Sidebar>

    <div class="flex grow flex-col overflow-y-auto">
        <header
            class="sticky top-0 z-10 flex h-12 w-full shrink-0 flex-row items-center justify-center gap-2 bg-secondary px-2"
        >
            <SidebarToggleButton
                bind:open={
                    () => leftSidebar?.isOpen() ?? false, (value) => leftSidebar?.setOpen(value)
                }
                side="left"
                class="lg:hidden"
            />
            <TitleBar />
            <SidebarToggleButton
                bind:open={
                    () => rightSidebar?.isOpen() ?? false, (value) => rightSidebar?.setOpen(value)
                }
                side="right"
                class="lg:hidden"
            />
        </header>

        {@render children()}
    </div>

    <Sidebar side="right" bind:this={rightSidebar}>
        {#snippet toolbar()}
            <input
                bind:value={scriptQuery}
                type="search"
                name="script-search"
                aria-label="Search scripts"
                placeholder="Search"
                class="h-7 min-w-0 grow"
            />
        {/snippet}

        <div class="flex size-full flex-col text-sm">
            <ScriptTree scriptPaths={searchedPaths} expandAll={!!scriptQuery} />
        </div>
    </Sidebar>
</div>
