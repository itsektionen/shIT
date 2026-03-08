<script lang="ts">
    import Sortable from "sortablejs";
    import type { Attachment } from "svelte/attachments";

    import ScriptButton from "$lib/components/ScriptButton.svelte";
    import ButtonEditModal from "$lib/components/ButtonEditModal.svelte";

    import type { PageProps } from "./$types";
    import { createButton, getButtons, reorderButtons } from "$lib/db.remote";

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

    let editingModal: ButtonEditModal;
</script>

<svelte:head>
    <title>shIT {data.currentCollection && `- ${data.currentCollection.label}`}</title>
</svelte:head>

<ButtonEditModal bind:this={editingModal} />

<main class="grow">
    <ul
        class={[
            "grid grid-cols-[repeat(auto-fit,calc(var(--spacing)*64))]",
            "items-center justify-center gap-2 p-4 ",
        ]}
        {@attach sortable}
    >
        {#each await getButtons(data.currentCollection.id) as btn (btn.id)}
            <li class="flex h-full flex-row justify-center">
                <ScriptButton
                    {btn}
                    onEdit={(btn) => {
                        editingModal.edit(btn);
                    }}
                />
            </li>
        {/each}
    </ul>
    <form {...createButton}>
        <input
            {...createButton.fields.collectionId.as("hidden", "text")}
            value={data.currentCollection?.id}
        />
        <input
            {...createButton.fields.scriptPath.as("hidden", "text")}
            value={`Button #${(await getButtons(data.currentCollection.id)).length + 1}`}
        />
        <button type="submit" class="bg-rose-700">
            Very awesome temporary developer button adder 9000
        </button>
    </form>
</main>
