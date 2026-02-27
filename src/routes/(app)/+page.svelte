<script lang="ts">
    import { MediaQuery } from "svelte/reactivity";

    let mobileQuery = new MediaQuery("(max-width: 64rem)");
    let isMobile = $derived(mobileQuery.current);
</script>

<main class="flex grow flex-col gap-2 p-2">
    <p class="mb-2">
        shIT is the webapp for easily controlling hardware and software in Kistan 2.0.
    </p>

    <div class="border-2 border-orange-400 bg-amber-200/50 p-2 text-center dark:bg-amber-700/50">
        <h3>IMPORTANT NOTE!!</h3>
        <p>
            You should only ever mess with Kistan while physically present.
            <br />
            If you are not there, make sure that you are not disturbing someone who is.
            <br />
            Do NOT run scripts during events you are not working.
        </p>
    </div>

    <h3>How to use shIT</h3>
    <p>
        {#if isMobile}
            In the upper left corner of your screen, you can find a button to expand the collections
            sidebar.
        {:else}
            On the left side of your screen, you see the collections sidebar.
        {/if}
        It has a list of button collections used by various committes, events, etc. A new one can be created
        using the very obvious button. If you ever want to get back here, just click the currently selected
        category again.
    </p>
    <p>
        {#if isMobile}
            In the upper right corner of your screen, you can find a button to expand the scripts
            sidebar.
        {:else}
            On the right side of your screen, you see the scripts sidebar.
        {/if}
        It holds a tree of all the scripts provided by LMixer, the light-mixer software used in Kistan.
        <br />
        A script can either be run directly by clicking on it in the sidebar, or dragged and dropped into
        the collection body to create a button.
    </p>
</main>
