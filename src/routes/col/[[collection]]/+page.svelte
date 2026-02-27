<script lang="ts">
    import fuzzysort from "fuzzysort";
    import { page } from "$app/state";
    import Sortable from "sortablejs";
    import type { Attachment } from "svelte/attachments";
    import { resolve } from "$app/paths";
    import type { PageProps } from "./$types";

    import logo from "$lib/assets/SMN Logo.svg";
    import Sidebar from "$lib/components/Sidebar.svelte";
    import ScriptButton from "$lib/components/ScriptButton.svelte";
    import EditModal from "$lib/components/EditModal.svelte";
    import SidebarToggleButton from "$lib/components/SidebarToggleButton.svelte";

    import AddIcon from "@iconify-svelte/material-symbols/add-2-rounded";
    import shitNames from "$lib/shit.txt?raw";
    import ScriptTree from "$lib/components/ScriptTree.svelte";

    let { data, params }: PageProps = $props();

    const sortable: Attachment<HTMLElement> = (element) => {
        // const sortable = Sortable.create(element, {
        //     animation: 100,
        //     onEnd(event) {
        //         if (
        //             event.from !== event.to ||
        //             event.oldIndex === undefined ||
        //             event.newIndex === undefined
        //         )
        //             return;
        //         // Make the array stay in sync with the UI
        //         const items = currentCollection.buttons;
        //         const [moved] = items.splice(event.oldIndex, 1);
        //         items.splice(event.newIndex, 0, moved);
        //     },
        // });
        // return () => sortable.destroy();
    };

    let collectionSearch = $state("");
    let scriptSearch = $state("");

    let leftSidebar: Sidebar;
    let rightSidebar: Sidebar;

    let editingModal: EditModal;
</script>

<svelte:head>
    <title>shIT {data.currentCollection && `- ${data.currentCollection.label}`}</title>
</svelte:head>

<EditModal bind:this={editingModal} />

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
                            collection.id === params.collection ? "/col" : `/col/${collection.id}`,
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
                        class="peer min-h-12 w-full text-center placeholder:invisible"
                        autocomplete="off"
                    />
                    <!-- Custom placeholder with icon -->
                    <div
                        class={[
                            "not-sr-only hidden peer-placeholder-shown:flex peer-focus-within:hidden",
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

    <div class="flex grow flex-col justify-center">
        <header
            class="flex h-12 shrink-0 flex-row items-center justify-center gap-2 bg-secondary px-2"
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
                {shitNames.split("\n")[Math.floor(Math.random() * shitNames.split("\n").length)]}
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
        <main class="grow overflow-y-auto">
            {#if data.buttons === undefined}
                <div
                    class="flex h-full flex-col items-center justify-center gap-4 text-center text-lg text-secondary-foreground"
                >
                    <p>No buttons found in this collection.</p>
                </div>
            {:else}
                <ul
                    class={[
                        "grid grid-cols-[repeat(auto-fit,minmax(calc(var(--spacing)*64),1fr))]",
                        "items-center justify-center gap-2 p-4 ",
                    ]}
                    {@attach sortable}
                >
                    {#each data.buttons as btn (btn.uuid)}
                        <li class="flex h-full flex-row justify-center">
                            <ScriptButton
                                {btn}
                                onEdit={(btn) => {
                                    editingModal.edit(btn);
                                }}
                            />
                        </li>
                    {/each}
                    <!-- TODO: Remove temporary debug button -->
                    {#if !data.buttons}
                        <li class="flex h-full flex-row justify-center">
                            <form
                                class="flex h-12 w-full items-center justify-center bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                method="POST"
                                action="?/addButton"
                            >
                                <input
                                    type="text"
                                    class="hidden"
                                    name="collectionId"
                                    value={data.currentCollection?.id ?? "tmp"}
                                />
                                <input type="text" class="hidden" name="script" value="tmp" />
                                <button
                                    type="submit"
                                    class="flex items-center justify-center gap-2"
                                >
                                    <AddIcon class="size-[1lh]" />
                                    <span>Add new button</span>
                                </button>
                            </form>
                        </li>
                    {/if}
                </ul>
            {/if}
        </main>
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
