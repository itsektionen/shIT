<script lang="ts">
    import { MediaQuery } from "svelte/reactivity";
    import EditIcon from "@iconify-svelte/material-symbols/edit-rounded";
    import ReadIcon from "@iconify-svelte/material-symbols/terminal-rounded";

    let querySlim = new MediaQuery("(max-width: 64rem)");
    let isSlim = $derived(querySlim.current);
    let queryTouch = new MediaQuery("(pointer: coarse)");
    let isTouch = $derived(queryTouch.current);
</script>

<main class="flex grow justify-center p-6">
    <section class="flex w-full max-w-2xl flex-col gap-2 leading-relaxed">
        <p>shIT is the control panel for hardware and software in Kistan 2.0.</p>

        <h3>Layout & Navigation</h3>
        <p>
            {#if isSlim}
                Use the top-left button for <strong>Collections</strong> and the top-right button
                for <strong>Scripts</strong>.
            {:else}
                <strong>Collections</strong> are on the left, and <strong>Scripts</strong> are on the
                right.
            {/if}
            Collections group different setups (committees, events, etc.) into sets of buttons. The Scripts
            sidebar contains a searchable tree of LMixer scripts. Clicking a collection switches to it,
            and clicking an already selected collection returns you to this guide.
        </p>

        <h3>Run and Edit Modes</h3>
        <p>
            Toggle the top title bar button (<ReadIcon class="inline size-[0.7lh]" />
            or <EditIcon class="inline size-[0.7lh]" />) to switch between controlling the locale
            and customizing this interface.
        </p>
        <ul>
            <li>
                <span class="inline-flex items-center gap-1 align-middle">
                    <ReadIcon class="inline size-[0.7lh]" />
                    <strong>Run mode:</strong>
                </span>
                Click a button in a collection or directly in the scripts sidebar to run it in LMixer.
            </li>
            <li>
                <span class="inline-flex items-center gap-1 align-middle">
                    <EditIcon class="inline size-[0.7lh]" />
                    <strong>Edit mode:</strong>
                </span>
                Customize the interface. You can edit labels, icons, and colors, delete items, or drag
                to reorder buttons. To add a new button:
                {#if isTouch}
                    tap a script in the sidebar to add it to the current collection.
                {:else}
                    drag a script from the sidebar and drop it into the collection area.
                {/if}
            </li>
        </ul>

        <div
            class="mt-2 w-full border-2 border-orange-400 bg-amber-200/50 p-4 dark:bg-amber-700/50"
        >
            <h3>IMPORTANT!!</h3>
            <ol class="list-decimal pl-4">
                <li>Only use this panel while physically present in Kistan.</li>
                <li>Do not disturb others in the locale.</li>
                <li>Do not run scripts during events you are not working.</li>
            </ol>
        </div>
    </section>
</main>
