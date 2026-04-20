<script lang="ts">
    let {
        color = $bindable(),
        ...inputProps
    }: {
        color: string | null;
        [key: string]: unknown;
    } = $props();

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
    <button
        type="button"
        title="Default"
        class={[
            "m-0.5 size-6 cursor-pointer rounded border-2 bg-secondary",
            color === null ? "border-brand" : "",
        ]}
        onclick={() => {
            color = null;
        }}
    >
    </button>

    <div
        class={[
            "rainbow-gradient relative m-0.5 size-6 rounded border-2",
            color && !colors.some(([c]) => c === color) ? "border-brand" : "",
        ]}
    >
        <input
            {...inputProps}
            class="absolute inset-0 size-full cursor-pointer opacity-0"
            title="Custom"
            value={color ?? "#000000"}
            oninput={(event) => {
                color = event.currentTarget.value;
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
                    color === col ? "border-brand" : "",
                ]}
                style:background-color={col}
                onclick={() => {
                    color = col;
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
