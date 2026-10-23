<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        onclose,
        preview,
        previewClass = "",
        children,
    }: {
        onclose: () => void;
        preview?: Snippet;
        previewClass?: string;
        children: Snippet;
    } = $props();
</script>

<dialog
    {@attach (element) => {
        element.showModal();
        return () => element.close();
    }}
    closedby="any"
    onclose={() => onclose()}
    onclick={(event) => {
        // I hate safari (emulate dismiss if missing)
        const supportsClosedBy =
            typeof HTMLDialogElement !== "undefined" && "closedBy" in HTMLDialogElement.prototype;
        if (!supportsClosedBy && event.target === event.currentTarget) onclose();
    }}
    style:width="min(calc(var(--spacing) * 90), 100%)"
    class={[
        "bg-transparent text-foreground select-none",
        "flex flex-col",
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible",
        "backdrop:bg-black/40 backdrop:backdrop-blur-sm",
    ]}
>
    {#if preview}
        <div class="pointer-events-none flex w-full justify-center" inert>
            <div class={["border-2 border-b-0 bg-background p-4 shadow-xl", previewClass]}>
                {@render preview()}
            </div>
        </div>
    {/if}

    {@render children()}
</dialog>
