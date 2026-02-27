<script lang="ts">
    import Sortable from "sortablejs";
    import type { Attachment } from "svelte/attachments";

    import Sidebar from "$lib/components/Sidebar.svelte";
    import ScriptButton from "$lib/components/ScriptButton.svelte";
    import EditModal from "$lib/components/EditModal.svelte";

    import AddIcon from "@iconify-svelte/material-symbols/add-2-rounded";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();

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

    let leftSidebar: Sidebar;
    let rightSidebar: Sidebar;

    let editingModal: EditModal;
</script>

<svelte:head>
    <title>shIT {data.currentCollection && `- ${data.currentCollection.label}`}</title>
</svelte:head>

<EditModal bind:this={editingModal} />

<main class="grow">
    {#if data.currentCollection === undefined}
        <div
            class="flex h-full flex-col items-center justify-center gap-4 text-center text-lg text-secondary-foreground"
        >
            <p>No collection selected.</p>
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
                        <button type="submit" class="flex items-center justify-center gap-2">
                            <AddIcon class="size-[1lh]" />
                            <span>Add new button</span>
                        </button>
                    </form>
                </li>
            {/if}
        </ul>
    {/if}
</main>
