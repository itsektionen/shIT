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

    // Initualy unset, to let CSS decide the initial state (prevents flashing during initial paint)
    let expanded = $state<boolean | undefined>(undefined);
    // Then we can do the fancy smart stuff
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

<aside
    class={["sidebar flex flex-col bg-background", side === "left" ? "border-r" : "border-l"]}
    aria-label="{side} sidebar"
    data-expanded={expanded}
    data-side={side}
>
    <header
        class={[
            "relative flex h-12 w-full shrink-0 items-center overflow-hidden border-b px-2",
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

    <div class="relative w-full grow overflow-y-auto">
        <div class="sidebar-contents flex h-full w-full flex-col p-2">
            {@render children()}
        </div>
    </div>
</aside>

<style>
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
            overflow-x: hidden;
        }
    }

    /* Mobile & tablet */
    @media (max-width: 64rem) {
        .sidebar {
            border: none;
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
