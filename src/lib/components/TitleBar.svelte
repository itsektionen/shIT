<script lang="ts">
    import { resolve } from "$app/paths";
    import { getEditModeContext } from "#lib/context.js";

    import acronymsString from "#lib/acronyms.txt?raw";
    import logo from "#lib/assets/SMN Logo.svg";
    import EditIcon from "~icons/material-symbols/edit-rounded";
    import ReadIcon from "~icons/material-symbols/terminal-rounded";

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
        class="icon-button flex size-9 shrink-0 items-center justify-center self-center justify-self-start"
    >
        {#if editMode.isEditing}
            <span title="Editing"><EditIcon class="size-7"></EditIcon></span>
        {:else}
            <span title="Running"><ReadIcon class="size-7"></ReadIcon></span>
        {/if}
    </button>
    <a
        href={resolve("/(app)")}
        class="flex flex-row items-center justify-center gap-2 overflow-hidden"
    >
        <img src={logo} alt="" class="size-8 lg:hidden" />
        <h1>shIT</h1>
        <img src={logo} alt="" class="size-8" />
        <span class="truncate text-2xl text-nowrap not-lg:hidden">
            {acronym}
        </span>
    </a>
</span>
