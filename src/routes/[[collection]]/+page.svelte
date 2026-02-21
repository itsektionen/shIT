<script lang="ts">
    import fuzzysort from "fuzzysort";
    import { page } from "$app/state";
    import Sortable from "sortablejs";
    import type { Attachment } from "svelte/attachments";

    import Sidebar from "$lib/components/Sidebar.svelte";
    import FileNode, { expandTree, type FileTreeNode } from "$lib/components/FileNode.svelte";
    import ScriptButton, { type Button } from "$lib/components/ScriptButton.svelte";
    import EditModal from "$lib/components/EditModal.svelte";

    import logo from "$lib/assets/SMN Logo.svg";
    import RefreshIcon from "@iconify-svelte/material-symbols/refresh-rounded";
    import { resolve } from "$app/paths";
    import SidebarToggleButton from "$lib/components/SidebarToggleButton.svelte";

    interface Collection {
        id: string;
        label: string;
        buttons: Button[];
    }
    let collections: Collection[] = $state([
        {
            id: "default",
            label: "Default",
            buttons: [
                {
                    uuid: "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
                        (
                            +c ^
                            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
                        ).toString(16),
                    ),
                    label: "Shot roulette",
                    color: "#E91E63",
                    iconId: "mdi:glass-cocktail",
                },
                {
                    uuid: "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
                        (
                            +c ^
                            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
                        ).toString(16),
                    ),
                    label: "All off",
                    color: "#9E9E9E",
                    iconId: "mdi:power-off",
                },
                {
                    uuid: "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
                        (
                            +c ^
                            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
                        ).toString(16),
                    ),
                    label: "Sound on",
                    color: "#4CAF50",
                    iconId: "mdi:volume-high",
                },
                {
                    uuid: "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
                        (
                            +c ^
                            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
                        ).toString(16),
                    ),
                    label: "Sound off",
                    color: "#F44336",
                    iconId: "mdi:volume-off",
                },
                {
                    uuid: "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
                        (
                            +c ^
                            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
                        ).toString(16),
                    ),
                    label: "Roof off",
                    color: "#2196F3",
                    iconId: "mdi:lightbulb-group-off",
                },
                {
                    uuid: "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
                        (
                            +c ^
                            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
                        ).toString(16),
                    ),
                    label: "Roof on",
                    color: "#FFEB3B",
                    iconId: "mdi:lightbulb-group",
                },
                {
                    uuid: "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
                        (
                            +c ^
                            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
                        ).toString(16),
                    ),
                    label: "Scene on",
                    color: "#673AB7",
                    iconId: "mdi:track-light",
                },
                {
                    uuid: "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
                        (
                            +c ^
                            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
                        ).toString(16),
                    ),
                    label: "Scene off",
                    color: "#3F51B5",
                    iconId: "mdi:track-light-off",
                },
            ],
        },
    ]);

    let fileTree: FileTreeNode[] = expandTree([
        "scripts/deploy.sh",
        "scripts/test.sh",
        "scripts/utils/cleanup.sh",
        "scripts/utils/backup.sh",
        "README.md",
        "src/index.js",
        "src/components/Button.svelte",
        "src/components/Sidebar.svelte",
    ]);

    let sortedTree = $derived(
        [...fileTree].sort((a, b) => {
            if (a.type === b.type) return a.path.localeCompare(b.path);
            return a.type === "directory" ? -1 : 1;
        }),
    );

    const sortable: Attachment<HTMLElement> = (element) => {
        const sortable = Sortable.create(element, {
            animation: 100,
            onEnd(event) {
                if (
                    event.from !== event.to ||
                    event.oldIndex === undefined ||
                    event.newIndex === undefined
                )
                    return;
                // Make the array stay in sync with the UI
                const items = currentCollection.buttons;
                const [moved] = items.splice(event.oldIndex, 1);
                items.splice(event.newIndex, 0, moved);
            },
        });
        return () => sortable.destroy();
    };

    let currentCollection: Collection = $derived.by(() => {
        const id = page.params.collection;
        return collections.find((c) => c.id === id) ?? collections[0];
    });

    let collectionSearch = $state("");
    let scriptSearch = $state("");

    let leftSidebar: Sidebar;
    let rightSidebar: Sidebar;

    let editingModal: EditModal;
</script>

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
                      .go(collectionSearch, collections, { key: "label" })
                      .map((r) => r.obj) : collections as collection (collection.label)}
                <li>
                    <a
                        class={[
                            "flex min-h-12 w-full items-center justify-center text-wrap hover:opacity-80",
                            collection === currentCollection ? "bg-brand/20" : "bg-secondary",
                        ]}
                        href={resolve(`/${collection.id}`)}
                        tabindex="0"
                    >
                        <span class="text-lg">{collection.label}</span>
                    </a>
                </li>
            {/each}
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
            <span class="text-2xl not-xl:hidden">shellless Input Terminal</span>

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
            <ul
                class={[
                    "grid grid-cols-[repeat(auto-fit,minmax(calc(var(--spacing)*64),1fr))]",
                    "items-center justify-center gap-2 p-4 ",
                ]}
                {@attach sortable}
            >
                {#each currentCollection.buttons as btn (btn.uuid)}
                    <li class="flex h-full flex-row justify-center">
                        <ScriptButton
                            {btn}
                            onEdit={async (btn) => {
                                const updatedButton = await editingModal.edit(btn);
                                switch (updatedButton) {
                                    case null:
                                        // User chose to delete the button
                                        currentCollection.buttons =
                                            currentCollection.buttons.filter(
                                                (b) => b.uuid !== btn.uuid,
                                            );
                                        break;
                                    case undefined:
                                        // User canceleted. Do nothing.
                                        break;
                                    default:
                                        // Otherwise, update the button with the new values
                                        Object.assign(btn, updatedButton);
                                        break;
                                }
                            }}
                        />
                    </li>
                {/each}
            </ul>
        </main>
    </div>

    <Sidebar side="right" bind:this={rightSidebar}>
        {#snippet toolbar()}
            <input
                type="search"
                aria-label="Search scripts"
                placeholder="Search"
                class="h-7 min-w-0 grow"
            />
            <button class="icon-button size-7 shrink-0" aria-label="Refresh scripts">
                <RefreshIcon />
            </button>
        {/snippet}

        <div class="flex h-full w-full flex-col overflow-auto px-1 py-2 text-sm select-none">
            {#each sortedTree as node (node.path)}
                <FileNode {node} />
            {/each}
        </div>
    </Sidebar>
</div>
