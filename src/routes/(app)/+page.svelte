<script lang="ts">
    import { MediaQuery } from "svelte/reactivity";

    let mobileQuery = new MediaQuery("(max-width: 64rem)");
    let isMobile = $derived(mobileQuery.current);
</script>

<main class="flex grow justify-center p-6">
    <section class="flex w-full max-w-2xl flex-col gap-2 leading-relaxed">
        <p>shIT is the web app for easily controlling hardware and software in Kistan 2.0.</p>

        <h3>How to use shIT</h3>
        <p>
            {#if isMobile}
                In the upper left corner of your screen, you can find a button to expand the
                collections sidebar.
            {:else}
                On the left side of your screen, you see the collections sidebar.
            {/if}
            It has a list of button collections used by various committees, events, etc. You can create
            a new one using the obvious button. If you ever want to get back here, just click the currently
            selected category again.
        </p>
        <p>
            {#if isMobile}
                In the upper right corner of your screen, you can find a button to expand the
                scripts sidebar.
            {:else}
                On the right side of your screen, you see the scripts sidebar.
            {/if}
            It holds a tree of all the scripts provided by LMixer, the light-mixer software used in Kistan.
            <br />
            A script can either be run directly by clicking on it in the sidebar, or dragged and dropped
            into the collection body to create a button.
        </p>

        <div
            class="mt-2 w-full border-2 border-orange-400 bg-amber-200/50 p-4 dark:bg-amber-700/50"
        >
            <h3>IMPORTANT!!</h3>
            <ol class="list-decimal pl-4">
                <li>Only ever mess with Kistan while physically present.</li>
                <li>Make sure that you are not disturbing other people.</li>
                <li>Do NOT run scripts during events you are not working.</li>
            </ol>
        </div>
    </section>
</main>
