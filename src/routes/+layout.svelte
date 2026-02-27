<script lang="ts">
    import "./layout.css";
    import "@fontsource/poppins";
    import type { LayoutProps } from "./$types";
    import MetaTags from "$lib/components/MetaTags.svelte";

    let { children }: LayoutProps = $props();
</script>

<svelte:head>
    <svelte:boundary>
        <MetaTags />
        {#snippet failed()}
            <title>Failed to load page meta</title>
        {/snippet}
    </svelte:boundary>
</svelte:head>

{@render children()}
