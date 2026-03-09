<script lang="ts">
    import type { LayoutProps } from "./$types";
    import fuzzysort from "fuzzysort";
    import { resolve } from "$app/paths";

    import Sidebar from "$lib/components/Sidebar.svelte";
    import SidebarToggleButton from "$lib/components/SidebarToggleButton.svelte";
    import ScriptTree from "$lib/components/ScriptTree.svelte";

    import acronymsString from "$lib/acronyms.txt?raw";
    import logo from "$lib/assets/SMN Logo.svg";
    import AddIcon from "@iconify-svelte/material-symbols/add-2-rounded";
    import { createCollection, getCollections } from "$lib/db.remote";
    import { MediaQuery } from "svelte/reactivity";
    import { onMount } from "svelte";
    import { getScriptsContext, setScriptsContext } from "$lib/context";

    let { params, children }: LayoutProps = $props();

    const acronyms: string[] = acronymsString
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

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

    let leftSidebar: Sidebar;
    let rightSidebar: Sidebar;

    const isWideQuery = new MediaQuery("(min-width: 64rem)");
</script>

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
                    <a
                        class={[
                            "flex min-h-12 w-full items-center justify-center hover:opacity-80",
                            isCurrent ? "bg-brand/20" : "bg-secondary",
                        ]}
                        href={resolve(isCurrent ? "/" : `/col/${collection.id}`)}
                        tabindex="0"
                        onclick={() => {
                            if (!isWideQuery.current) leftSidebar.setOpen(false);
                        }}
                    >
                        <span class="truncate px-1 text-lg">{collection.label}</span>
                    </a>
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
            class="sticky top-0 flex h-12 shrink-0 flex-row items-center justify-center gap-2 bg-secondary px-2"
        >
            <SidebarToggleButton
                bind:open={
                    () => leftSidebar?.isOpen() ?? false, (value) => leftSidebar?.setOpen(value)
                }
                side="left"
                class="lg:hidden"
            />
            <span class="grow"></span>

            <img src={logo} alt="SMN Logo" class="size-8 lg:hidden" />
            <h1>shIT</h1>
            <img src={logo} alt="SMN Logo" class="size-8" />
            <span class="truncate text-2xl text-nowrap not-lg:hidden">
                {acronyms[Math.floor(Math.random() * acronyms.length)]}
            </span>

            <span class="grow"></span>
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

        <div class="flex h-full w-full flex-col overflow-auto px-1 py-2 text-sm select-none">
            <ScriptTree
                scriptPaths={scriptQuery
                    ? fuzzysort
                          .go(scriptQuery, getScriptsContext().paths ?? [])
                          .map((r) => r.target)
                    : (getScriptsContext().paths ?? [])}
            />
        </div>
    </Sidebar>
</div>
