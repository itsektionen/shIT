<script lang="ts">
    import { type Snippet } from "svelte";
    import { slide, fade } from "svelte/transition";
    import { MediaQuery } from "svelte/reactivity";

    import SidebarToggleButton from "./SidebarToggleButton.svelte";

    const isWideQuery = new MediaQuery("(min-width: 64rem)"); // Tailwind "lg" breakpoint

    let {
        side = "left",
        width = "w-64",
        children,
        toolbar,
        ...rest
    }: {
        side?: "left" | "right";
        width?: string; // Customizable width (default w-64)
        children: Snippet;
        toolbar?: Snippet;
        [key: string]: unknown;
    } = $props();

    let open = $state(true);

    $effect(() => {
        // Automatically close sidebar on mobile when switching to narrow view
        if (!isWideQuery.current) {
            open = false;
        }
    });

    export function isOpen() {
        return open;
    }
    export function setOpen(value: boolean) {
        open = value;
    }
</script>

<!-- svelte-ignore a11y_role_supports_aria_props_implicit -->
<aside
    class={[
        "flex flex-col bg-background",
        isWideQuery.current
            ? [
                  "h-full transition-[width] duration-300 ease-in-out",
                  side === "left" ? "border-r" : "border-l",
                  open ? width : "w-12",
              ]
            : [
                  "fixed top-0 z-100 h-dvh w-dvw transition-[left,right,display] transition-discrete",
                  // 3. Toggle display
                  open ? "block" : "hidden",
                  // 4. Handle positions AND starting-styles
                  side === "left"
                      ? open
                          ? "left-0 starting:-left-full" // Where it starts when display becomes block
                          : "-left-full"
                      : open
                        ? "right-0 starting:-right-full"
                        : "-right-full",
              ],
    ]}
    aria-expanded={open}
    aria-label="{side} sidebar"
    {...rest}
>
    <header
        class={[
            "relative flex h-12 w-full shrink-0 items-center overflow-hidden border-b px-2",
            side === "left" ? "flex-row" : "flex-row-reverse",
        ]}
    >
        {#if open || !isWideQuery.current}
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

        <SidebarToggleButton
            bind:open
            {side}
            class={["absolute", side === "left" ? "right-2.5" : "left-2.5"]}
        />
    </header>

    <div class="w-full flex-1 overflow-x-hidden overflow-y-auto">
        {#if open || !isWideQuery.current}
            <div class="flex h-full flex-col p-2" transition:fade={{ duration: 150 }}>
                {@render children()}
            </div>
        {/if}
    </div>
</aside>
