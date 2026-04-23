<script lang="ts">
    import { getEditModeContext } from "$lib/context";
    import EditIcon from "@iconify-svelte/material-symbols/edit-rounded";
    import ReadIcon from "@iconify-svelte/material-symbols/terminal-rounded";

    let editMode = getEditModeContext();
</script>

<button
    type="button"
    role="switch"
    aria-checked={editMode.isEditing}
    aria-label="Edit Mode"
    onclick={() => {
        editMode.isEditing = !editMode.isEditing;
    }}
    class="flex flex-row items-center justify-end"
>
    {#if editMode.isEditing}
        <span class="mx-2 text-lg font-semibold">Editing</span>
        <EditIcon class="size-7"></EditIcon>
    {:else}
        <ReadIcon class="size-7"></ReadIcon>
    {/if}
</button>
