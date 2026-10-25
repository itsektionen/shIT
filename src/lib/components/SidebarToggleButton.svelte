<script lang="ts">
    import LeftPanelOpen from "~icons/material-symbols/left-panel-open-rounded";
    import LeftPanelClose from "~icons/material-symbols/left-panel-close-rounded";
    import RightPanelOpen from "~icons/material-symbols/right-panel-open-rounded";
    import RightPanelClose from "~icons/material-symbols/right-panel-close-rounded";
    import type { ClassValue } from "svelte/elements";

    let {
        open = $bindable(false),
        side,
        class: className,
    }: {
        open: boolean;
        side: "left" | "right";
        class?: ClassValue;
    } = $props();

    const ToggleIcon = $derived.by(() => {
        if (side === "left") {
            return open ? LeftPanelClose : LeftPanelOpen;
        } else {
            return open ? RightPanelClose : RightPanelOpen;
        }
    });
</script>

<button
    class={["icon-button size-7 shrink-0", className]}
    onclick={() => (open = !open)}
    aria-label={open ? "Close sidebar" : "Open sidebar"}
>
    <ToggleIcon class="size-full" />
</button>
