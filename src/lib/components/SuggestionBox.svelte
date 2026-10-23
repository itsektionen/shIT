<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        show = true,
        children,
        suggestions,
    }: {
        show?: boolean;
        children: Snippet;
        suggestions: Snippet;
    } = $props();

    let dismissed = $state(false);

    function reopen(e: Event) {
        if (e.target instanceof HTMLInputElement) dismissed = false;
    }
</script>

<div
    class="group relative"
    onkeydown={(e) => {
        // first escape only closes the list
        if (e.key !== "Escape" || dismissed) return;
        e.preventDefault();
        e.stopPropagation();
        dismissed = true;
        if (e.target instanceof HTMLElement) e.target.blur();
    }}
    oninput={reopen}
    onfocusin={reopen}
    role="presentation"
>
    {@render children()}
    <div
        class={[
            "max-h-40 w-full flex-col overflow-y-auto bg-secondary",
            "[scrollbar-color:var(--color-border)_transparent] [scrollbar-width:thin]",
            dismissed || !show ? "hidden" : "hidden group-focus-within:flex",
        ]}
    >
        {@render suggestions()}
    </div>
</div>
