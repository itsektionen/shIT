<script lang="ts">
    import type { RemoteFormField } from "@sveltejs/kit";
    import EraserIcon from "@iconify-svelte/material-symbols/ink-eraser-rounded";

    let { field }: { field: RemoteFormField<string> } = $props();

    const NULL_COLOR = "";
    const DEFAULT_COLOR = "#000000";

    const colors = [
        ["#000000", "Black"],
        ["#777777", "Grey"],
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
        ["#9f0712", "Dark Red"],
        ["#973c00", "Dark Orange (aka brown)"],
        ["#894b00", "Dark Yellow"],
        ["#3c6300", "Dark Lime"],
        ["#016630", "Dark Green"],
        ["#005f5a", "Dark Teal"],
        ["#00598a", "Dark Sky"],
        ["#653290", "Dark Laserviolet"],
        ["#8f0045", "Dark Rosa"],
        [],
        ["#cc99ff", "Laserviolet"],
        ["#44687d", "Silicone blue"],
        ["#acff5b", "ITK Green"],
        ["#800000", "QMISK Ockraröd"],
        ["#004791", "KTH-Blue"],
        ["#45b8da", "THS-Blue"],
        ["#a2ee8d", "TBas Green"],
    ] as const;
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
