<script lang="ts">
    import type { RemoteFormField } from "@sveltejs/kit";
    import EraserIcon from "@iconify-svelte/material-symbols/ink-eraser-rounded";

    let { field }: { field: RemoteFormField<string> } = $props();

    type HEX = `#${string}`;

    const NULL_COLOR = "" as const;
    const DEFAULT_COLOR: HEX = "#000000";

    const colors = [
        ["#000000", "Black"],
        ["#222222", "Dark Grey"],
        ["#636363", "Grey"],
        ["#aeaeae", "Light Grey"],
        ["#ffffff", "White"],
        [],
        ["#ff6467", "Red"],
        ["#ff8904", "Orange"],
        ["#fcc800", "Yellow"],
        ["#9ae600", "Lime"],
        ["#05df72", "Green"],
        ["#00d5be", "Teal"],
        ["#00bcff", "Sky"],
        ["#cc99ff", "Laserviolet"],
        ["#e83d84", "Rosa"],
        [],
        // Dark colors are calculated by:
        // oklch(from color-mix(in oklab, <color1>, oklch(0.4 0.25 270) 10%) <color1 OKLCH lightness> c h)
        // Where color1 is the original dark color we stole from tailwind.
        // The specific blue colour and the 10% factor are completely arbitrary
        ["#9d0137", "Dark Red"],
        ["#973c00", "Dark Orange (aka brown)"],
        ["#805100", "Dark Yellow"],
        ["#0b682b", "Dark Lime"],
        ["#00694e", "Dark Green"],
        ["#005e61", "Dark Teal"],
        ["#00598a", "Dark Sky"],
        ["#653290", "Dark Laserviolet"],
        ["#8c044f", "Dark Rosa"],
        [],
        ["#cc99ff", "Laserviolet"],
        ["#44687d", "Silicone blue"],
        ["#acff5b", "ITK Green"],
        ["#800000", "QMISK Ockraröd"],
        ["#004791", "KTH-Blue"],
        ["#45b8da", "THS-Blue"],
        ["#a2ee8d", "TBas Green"],
    ] satisfies ([HEX, string] | [])[];

    /*[
        oklch(from color-mix(in oklab, oklch(44.4% 0.177 26.899), oklch(0.4 0.25 270) 15%) 44.4% 0.177 h)
        oklch(from color-mix(in oklab, oklch(47.0% 0.157 37.304), oklch(0.4 0.25 270) 15%) 47.0% 0.157 h)
        oklch(from color-mix(in oklab, oklch(47.6% 0.114 61.907), oklch(0.4 0.25 270) 15%) 47.6% 0.114 h)
        oklch(from color-mix(in oklab, oklch(45.3% 0.124 130.933), oklch(0.4 0.25 270) 15%) 45.3% 0.124 h)
        oklch(from color-mix(in oklab, oklch(44.8% 0.119 151.328), oklch(0.4 0.25 270) 15%) 44.8% 0.119 h)
        oklch(from color-mix(in oklab, oklch(43.7% 0.078 188.216), oklch(0.4 0.25 270) 15%) 43.7% 0.078 h)
        oklch(from color-mix(in oklab, oklch(44.3% 0.11 240.79), oklch(0.4 0.25 270) 15%) 44.3% 0.11 h)
        oklch(from color-mix(in oklab, oklch(43.8% 0.1502 306.19), oklch(0.4 0.25 270) 15%) 43.8% 0.1502 h)
        oklch(from color-mix(in oklab, oklch(41.95% 0.169271 2.4025), oklch(0.4 0.25 270) 15%) 41.95% 0.169271 h)
    ]*/
</script>

<div class="flex flex-wrap">
    <input {...field.as("text")} class="hidden" />

    <button
        type="button"
        title="Default"
        class={[
            "m-0.5 size-6 cursor-pointer rounded border-2 bg-secondary",
            field.value() === NULL_COLOR ? "border-brand" : "",
        ]}
        onclick={() => {
            field.set(NULL_COLOR);
        }}
    >
        <EraserIcon class="size-full text-foreground/25" />
    </button>

    <div
        class={[
            "rainbow-gradient relative m-0.5 size-6 rounded border-2",
            field.value() && !colors.some(([c]) => c === field.value()) ? "border-brand" : "",
        ]}
    >
        <input
            type="color"
            class="absolute inset-0 size-full cursor-pointer opacity-0"
            title="Custom"
            value={field.value() === NULL_COLOR ? DEFAULT_COLOR : field.value()}
            oninput={(event) => {
                field.set(event.currentTarget.value);
            }}
        />
    </div>

    {#each colors as [col, name], i (i)}
        {#if col}
            <button
                type="button"
                title={name}
                class={[
                    "m-0.5 size-6 cursor-pointer rounded border-2",
                    field.value() === col ? "border-brand" : "",
                ]}
                style:background-color={col}
                onclick={() => {
                    field.set(col);
                }}
            >
            </button>
        {:else}
            <div class="w-full shrink"></div>
        {/if}
    {/each}
</div>

<style>
    .rainbow-gradient {
        background: conic-gradient(in oklch longer hue, oklch(0.75 0.12 0), oklch(0.75 0.12 0));
    }
</style>
