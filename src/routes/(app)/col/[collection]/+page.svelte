<script lang="ts">
    import Sortable from "sortablejs";
    import type { Attachment } from "svelte/attachments";

    import ButtonEditModal from "$lib/components/ButtonEditModal.svelte";

    import type { PageProps } from "./$types";
    import { createButton, getButtons, reorderButtons } from "$lib/db.remote";
    import { getEditModeContext } from "$lib/context";
    import ScriptButton from "$lib/components/buttons/ScriptButton.svelte";
    import type { buttonTable } from "$lib/server/db/schema";

    type Button = typeof buttonTable.$inferSelect;

    let { data }: PageProps = $props();

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

                if (!data.currentCollection) return;
                const buttons = await getButtons(data.currentCollection.id);
                const [moved] = buttons.splice(event.oldIndex, 1);
                buttons.splice(event.newIndex, 0, moved);
                // Send to the server
                reorderButtons(buttons.map((b) => b.id)).updates(
                    getButtons(data.currentCollection.id).withOverride((btns) =>
                        btns.sort((a, b) => {
                            const aIndex = buttons.findIndex((i) => i.id === a.id);
                            const bIndex = buttons.findIndex((i) => i.id === b.id);
                            return aIndex - bIndex;
                        }),
                    ),
                );
            },
        });
        return () => sortable.destroy();
    };

    let editingButton = $state<Button | undefined>(undefined);
    let editMode = getEditModeContext();
</script>

<svelte:head>
    <title>shIT {data.currentCollection && `- ${data.currentCollection.label}`}</title>
</svelte:head>

{#if editingButton}
    <ButtonEditModal button={editingButton} onclose={() => { editingButton = undefined; }} />
{/if}

<main
    class="grow"
    ondragover={(event) => {
        event.preventDefault(); // Indicate valid drop target
    }}
    ondrop={(event) => {
        if (!event.dataTransfer) return;
        const scriptPath = event.dataTransfer.getData("lmixer/script");
        if (!scriptPath) return;
        createButton({
            collectionId: data.currentCollection.id,
            scriptPath: scriptPath,
        });
    }}
>
    <ul
        class={[
            "grid grid-cols-[repeat(auto-fit,--spacing(64))]",
            "grow items-center justify-center gap-2 px-4 py-8",
        ]}
        {@attach editMode.isEditing ? sortable : undefined}
    >
        {#each await getButtons(data.currentCollection.id) as btn (btn.id)}
            <li class="flex h-full flex-row justify-center">
                <ScriptButton
                    {btn}
                    onEdit={(btn) => {
                        editingButton = btn;
                    }}
                />
            </li>
        {/each}
    </ul>
</main>
