<script lang="ts">
    import type { LayoutProps } from "./$types";
    import fuzzysort from "fuzzysort";
    import { resolve } from "$app/paths";

    import Sidebar from "$lib/components/Sidebar.svelte";
    import SidebarToggleButton from "$lib/components/SidebarToggleButton.svelte";
    import ScriptTree from "$lib/components/ScriptTree.svelte";
    import CollectionButton from "$lib/components/buttons/CollectionButton.svelte";
    import CollectionEditModal from "$lib/components/modals/CollectionEditModal.svelte";

    import AddIcon from "@iconify-svelte/material-symbols/add-2-rounded";
    import { createCollection, getCollections } from "$lib/db.remote";
    import { onMount } from "svelte";
    import {
        getScriptsContext,
        setCollectionContext,
        setEditModeContext,
        setScriptsContext,
    } from "$lib/context";
    import TitleBar from "$lib/components/TitleBar.svelte";

    import type { collectionTable } from "$lib/server/db/schema";

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
        const eventSource = new EventSource(resolve("/api/mqtt/script_paths"));
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
                aria-label="Search collections"
                placeholder="Search"
                class="h-7 min-w-0 grow"
            />
        {/snippet}

        <ul class="flex w-full flex-col gap-2" aria-label="Collections">
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
            <li>
                <form class="relative" {...createCollection}>
                    <input
                        {...createCollection.fields.label.as("text")}
                        placeholder="Create new collection"
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
            </li>
        </ul>
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
