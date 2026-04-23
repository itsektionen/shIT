<script lang="ts">
    import { type Snippet } from "svelte";
    import { MediaQuery } from "svelte/reactivity";
    import SidebarToggleButton from "./SidebarToggleButton.svelte";

    let {
        side = "left",
        children,
        toolbar,
    }: {
        side?: "left" | "right";
        children: Snippet;
        toolbar?: Snippet;
    } = $props();

    // Initially unset to let CSS decide the initial state
    // (prevents flashing during initial paint).
    // The linter rule does not understand the tiny difference from doing this in an effect.
    // eslint-disable-next-line svelte/prefer-writable-derived
    let expanded = $state<boolean | undefined>(undefined);
    const isWideQuery = new MediaQuery("(min-width: 64rem)");
    $effect(() => {
        expanded = isWideQuery.current;
    });

    export function isOpen() {
        return expanded;
    }
    export function setOpen(value: boolean) {
        expanded = value;
    }
</script>

<div
    class="sidebar-backdrop bg-black/20 backdrop-blur-sm"
    data-expanded={expanded}
    aria-hidden="true"
    onclick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        expanded = false;
    }}
></div>

<aside
    class={[
        "sidebar flex shrink-0 flex-col bg-background",
        side === "left" ? "border-r" : "border-l",
    ]}
    aria-label="{side} sidebar"
    data-expanded={expanded}
    data-side={side}
>
    <header
        class={[
            "relative flex h-12 w-full shrink-0 items-center overflow-hidden border-b bg-secondary px-2",
            side === "left" ? "flex-row" : "flex-row-reverse",
        ]}
    >
        <div
            class={[
                "sidebar-toolbar flex min-w-0 shrink grow flex-row items-center gap-2",
                side === "left" ? "mr-8 pr-2" : "ml-8 pl-2",
            ]}
        >
            {@render toolbar?.()}
        </div>

        <SidebarToggleButton
            bind:open={() => expanded ?? false, (value) => (expanded = value)}
            {side}
            class={["absolute", side === "left" ? "right-2.5" : "left-2.5"]}
        />
    </header>

    <div class="relative w-full grow">
        <div class="sidebar-contents flex size-full flex-col overflow-y-auto p-2">
            {@render children()}
        </div>
    </div>
</aside>

<style>
    .sidebar-backdrop {
        display: none;
    }

    /* Shared */
    .sidebar {
        top: 0;
        height: 100dvh;

        transition-timing-function: ease-in-out;
        transition-behavior: allow-discrete;

        .sidebar-contents {
            position: absolute;
            top: 0;
            right: 0;
        }
    }

    /* Mobile & tablet */
    @media (max-width: 64rem) {
        .sidebar-backdrop {
            display: block;
            inset: 0;
            z-index: 99;
            pointer-events: none;
            position: fixed;
            transition-property: opacity, visibility;
            transition-duration: 300ms;
            transition-behavior: allow-discrete;
            transition-timing-function: ease-in-out;
            visibility: hidden;
            opacity: 0;

            &[data-expanded="true"] {
                opacity: 1;
                visibility: visible;
                pointer-events: auto;
            }
        }

        .sidebar {
            position: fixed;
            z-index: 100;
            width: calc(var(--spacing) * 120);

            transition-property: left, right, visibility;
            transition-duration: 300ms;

            visibility: hidden;
            &[data-side="left"] {
                left: -100%;
            }
            &[data-side="right"] {
                right: -100%;
            }

            &[data-expanded="true"] {
                visibility: visible;
                &[data-side="left"] {
                    left: 0;
                }
                &[data-side="right"] {
                    right: 0;
                }
            }
        }
    }
    /* Mobile only */
    @media (max-width: 40rem) {
        .sidebar {
            width: 100dvw;
            border: none;
        }
    }

    /* Desktop */
    @media (min-width: 64rem) {
        .sidebar {
            --sidebar-width: calc(var(--spacing) * 80);
            width: var(--sidebar-width);
            transition-property: width;
            transition-duration: 150ms;

            .sidebar-toolbar,
            .sidebar-contents {
                transition-property: visibility;
                transition: ease-in-out allow-discrete;
                transition-duration: 150ms;
                visibility: visible;
            }
            .sidebar-contents {
                transition-property: visibility, opacity;
                opacity: 1;
                /* stops the contents from squishing as it dissapears */
                min-width: var(--sidebar-width);
            }
            &[data-expanded="false"] {
                width: 3rem;
                .sidebar-toolbar,
                .sidebar-contents {
                    visibility: hidden;
                }
                .sidebar-contents {
                    opacity: 0;
                }
            }
        }
    }
</style>
