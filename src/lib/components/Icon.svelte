<script lang="ts">
    import { iconToSVG, replaceIDs } from "@iconify/utils";
    import type { ClassValue } from "svelte/elements";
    import { getIcon } from "#lib/icons.remote.js";

    let { 
        icon, 
        class: className
    }: { 
        icon: string | null | undefined; 
        class?: ClassValue
    } = $props();

    const data = $derived(icon ? await getIcon(icon) : null);
    const svg = $derived(data && iconToSVG(data, { width: "1em", height: "1em" }));
</script>

{#if svg}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        class={className}
        {...svg.attributes}
    >
        <!-- eslint-disable-next-line svelte/no-at-html-tags -- content come from our own icon packs -->
        {@html replaceIDs(svg.body)}
    </svg>
{/if}
