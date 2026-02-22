<script lang="ts">
    import "./layout.css";
    import "@fontsource/poppins";
    import MetaTags from "$lib/components/MetaTags.svelte";

    let { children } = $props();
</script>

<svelte:head>
    <MetaTags />
</svelte:head>

{@render children()}
