<script lang="ts">
    import "./layout.css";
    import "@fontsource/poppins";
    import favicon from "$lib/assets/SMN Logo.svg";

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <title>shIT</title>
</svelte:head>

{@render children()}
