<script lang="ts">
    import { getEditModeContext } from "$lib/context";

    import acronymsString from "$lib/acronyms.txt?raw";
    import logo from "$lib/assets/SMN Logo.svg";
    import EditIcon from "@iconify-svelte/material-symbols/edit-rounded";
    import ReadIcon from "@iconify-svelte/material-symbols/terminal-rounded";

    const acronyms: string[] = acronymsString
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    const acronym = acronyms[Math.floor(Math.random() * acronyms.length)];

    let editMode = getEditModeContext();
</script>

<span class="grid max-w-full shrink grow grid-cols-[1fr_auto_1fr]">
    <button
        type="button"
        role="switch"
        aria-checked={editMode.isEditing}
        aria-label="Edit Mode"
        onclick={() => {
            editMode.isEditing = !editMode.isEditing;
        }}
        class="mr-2 flex flex-row items-center justify-start"
    >
        {#if editMode.isEditing}
            <span title="Editing"><EditIcon class="size-7"></EditIcon></span>
        {:else}
            <span title="Viewing"><ReadIcon class="size-7"></ReadIcon></span>
        {/if}
    </button>
    <span class="flex flex-row items-center justify-center gap-2 overflow-hidden">
        <img src={logo} alt="SMN Logo" class="size-8 lg:hidden" />
        <h1>shIT</h1>
        <img src={logo} alt="SMN Logo" class="size-8" />
        <span class="truncate text-2xl text-nowrap not-lg:hidden">
            {acronym}
        </span>
    </span>
</span>
