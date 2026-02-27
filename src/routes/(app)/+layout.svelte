<script lang="ts">
    import type { LayoutProps } from "./$types";
    import fuzzysort from "fuzzysort";
    import { resolve } from "$app/paths";

    import Sidebar from "$lib/components/Sidebar.svelte";
    import SidebarToggleButton from "$lib/components/SidebarToggleButton.svelte";
    import ScriptTree from "$lib/components/ScriptTree.svelte";

    import shitNames from "$lib/shit.txt?raw";
    import logo from "$lib/assets/SMN Logo.svg";
    import AddIcon from "@iconify-svelte/material-symbols/add-2-rounded";

    let { data, params, children }: LayoutProps = $props();

    let collectionSearch = $state("");
    let scriptSearch = $state("");

    let leftSidebar: Sidebar;
    let rightSidebar: Sidebar;
</script>

<div class="flex h-full flex-row justify-center">
    <Sidebar side="left" bind:this={leftSidebar}>
        {#snippet toolbar()}
            <input
                bind:value={collectionSearch}
                type="search"
                aria-label="Search collections"
                placeholder="Search"
                class="h-7 min-w-0 grow"
            />
        {/snippet}

        <ul class="flex w-full flex-col gap-2" aria-label="Collections">
            {#each collectionSearch ? fuzzysort
                      .go(collectionSearch, data.collections, { key: "label" })
                      .map((r) => r.obj) : data.collections as collection (collection.label)}
                <li>
                    <a
                        class={[
                            "flex min-h-12 w-full items-center justify-center text-wrap hover:opacity-80",
                            collection.id === params.collection ? "bg-brand/20" : "bg-secondary",
                        ]}
                        href={resolve(
                            collection.id === params.collection ? "/" : `/col/${collection.id}`,
                        )}
                        tabindex="0"
                    >
                        <span class="text-lg">{collection.label}</span>
                    </a>
                </li>
            {/each}
            <li>
                <form class="relative" method="POST" action="?/addCollection">
                    <input
                        name="label"
                        type="text"
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
                        <span>Create new collection</span>
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

            <img src={logo} alt="SMN Logo" class="size-8" />
            <h1>shIT</h1>
            <span class="h-8 w-px bg-secondary-foreground/50 not-xl:hidden"></span>
            <span class="text-2xl text-nowrap not-xl:hidden">
                {shitNames.trim().split("\n")[
                    Math.floor(Math.random() * shitNames.split("\n").length)
                ]}
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
                bind:value={scriptSearch}
                type="search"
                aria-label="Search scripts"
                placeholder="Search"
                class="h-7 min-w-0 grow"
            />
        {/snippet}

        <div class="flex h-full w-full flex-col overflow-auto px-1 py-2 text-sm select-none">
            <ScriptTree
                scriptPaths={scriptSearch
                    ? fuzzysort.go(scriptSearch, data.scriptPaths).map((r) => r.target)
                    : data.scriptPaths}
            />
        </div>
    </Sidebar>
</div>
