<script lang="ts">
    import EditIcon from "@iconify-svelte/material-symbols/edit-rounded";
    import ReadIcon from "@iconify-svelte/material-symbols/terminal-rounded";
</script>

<main class="flex grow justify-center p-6">
    <section class="flex w-full max-w-2xl flex-col gap-2 leading-relaxed">
        <p>shIT is the control panel for hardware and software in Kistan 2.0.</p>

        <h2 class="text-xl">Layout & Navigation</h2>
        <p>
            <!-- both rendered, css picks. swapping after hydration shifted the page -->
            <span class="lg:hidden">
                Use the top-left button for <strong>Collections</strong> and the top-right button
                for <strong>Scripts</strong>.
            </span>
            <span class="not-lg:hidden">
                <strong>Collections</strong> are on the left, and <strong>Scripts</strong> are on the
                right.
            </span>
            Collections group different setups (committees, events, etc.) into sets of buttons. The Scripts
            sidebar contains a searchable tree of LMixer scripts. Clicking a collection switches to it,
            and clicking an already selected collection returns you to this guide.
        </p>

        <h2 class="text-xl">Run and Edit Modes</h2>
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
                <span class="not-pointer-coarse:hidden">
                    tap a script in the sidebar to add it to the current collection.
                </span>
                <span class="pointer-coarse:hidden">
                    drag a script from the sidebar and drop it into the collection area.
                </span>
            </li>
        </ul>

        <div
            class="mt-2 w-full border-2 border-orange-400 bg-amber-200/50 p-4 dark:bg-amber-700/50"
        >
            <h2 class="text-xl">IMPORTANT!!</h2>
            <ol class="list-decimal pl-4">
                <li>Only use this panel while physically present in Kistan.</li>
                <li>Do not disturb others in the locale.</li>
                <li>Do not run scripts during events you are not working.</li>
            </ol>
        </div>
    </section>
</main>
