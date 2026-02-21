<script lang="ts">
    import { type Snippet } from "svelte";
    import { slide, fade } from "svelte/transition";

    import LeftPanelOpen from "@iconify-svelte/material-symbols/left-panel-open-rounded";
    import LeftPanelClose from "@iconify-svelte/material-symbols/left-panel-close-rounded";
    import RightPanelOpen from "@iconify-svelte/material-symbols/right-panel-open-rounded";
    import RightPanelClose from "@iconify-svelte/material-symbols/right-panel-close-rounded";

    let {
        side = "left",
        isOpen = $bindable(true),
        width = "w-64",
        children,
        toolbar,
        ...rest
    }: {
        side?: "left" | "right";
        isOpen?: boolean;
        width?: string; // Customizable width (default w-64)
        children: Snippet;
        toolbar?: Snippet;
        [key: string]: unknown;
    } = $props();

    const ToggleIcon = $derived.by(() => {
        if (side === "left") {
            return isOpen ? LeftPanelClose : LeftPanelOpen;
        } else {
            return isOpen ? RightPanelClose : RightPanelOpen;
        }
    });
</script>

<!-- svelte-ignore a11y_role_supports_aria_props_implicit -->
<aside
    class={[
        "flex flex-col transition-[width] duration-300 ease-in-out",
        side === "left" ? "border-r" : "border-l",
        isOpen ? width : "w-12",
    ]}
    aria-expanded={isOpen}
    aria-label="{side} sidebar"
    {...rest}
>
    <header
        class={[
            "relative flex h-12 w-full shrink-0 items-center overflow-hidden border-b px-2",
            side === "left" ? "flex-row" : "flex-row-reverse",
        ]}
    >
        {#if isOpen}
            <div
                class={[
                    "min-w-0 flex-1 overflow-hidden",
                    "flex flex-row items-center gap-2",
                    side === "left" ? "mr-8 pr-2" : "ml-8 pl-2",
                ]}
                transition:slide={{ axis: "x", duration: 200 }}
            >
                {@render toolbar?.()}
            </div>
        {/if}

        <button
            class={[
                "icon-button absolute size-7 shrink-0",
                side === "left" ? "right-2.5" : "left-2.5",
            ]}
            onclick={() => (isOpen = !isOpen)}
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
            <ToggleIcon />
        </button>
    </header>

    <div class="w-full flex-1 overflow-x-hidden overflow-y-auto">
        {#if isOpen}
            <div class="flex h-full flex-col p-2" transition:fade={{ duration: 150 }}>
                {@render children()}
            </div>
        {/if}
    </div>
</aside>
