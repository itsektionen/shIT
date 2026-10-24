<script lang="ts">
    import type { Snippet } from "svelte";
    import { MediaQuery } from "svelte/reactivity";
    import { afterNavigate } from "$app/navigation";
    import SidebarToggleButton from "./SidebarToggleButton.svelte";
    import { getEditModeContext } from "#lib/context.js";
    import { createDrawerSwipe } from "#lib/swipeDrawer.svelte.js";

    let {
        side = "left",
        children,
        toolbar,
    }: {
        side?: "left" | "right";
        children: Snippet;
        toolbar?: Snippet;
    } = $props();

    const editMode = getEditModeContext();
    const isWide = new MediaQuery("(min-width: 64rem)");
    let desktopOpen = $state(true);
    let mobileOpen = $state(false);
    const open = $derived(isWide.current ? desktopOpen : mobileOpen);

    export function isOpen() {
        return open;
    }
    export function setOpen(value: boolean) {
        if (isWide.current) {
            desktopOpen = value;
        } else {
            mobileOpen = value;
        }
    }

    // don't leave the drawer open for when the window shrinks again
    $effect(() => {
        if (isWide.current) mobileOpen = false;
    });

    // hack to prevent weird jumping when viewport changes between desktop and mobile
    let switching = $state(true);
    $effect(() => {
        void isWide.current;
        switching = true;
        const frame = requestAnimationFrame(() => requestAnimationFrame(() => (switching = false)));
        return () => cancelAnimationFrame(frame);
    });

    afterNavigate(() => {
        if (!isWide.current) mobileOpen = false;
    });

    const swipe = createDrawerSwipe({
        side: () => side,
        enabled: () => !isWide.current,
        canOpen: () =>
            !editMode.isEditing &&
            !document.querySelector("dialog[open], .sidebar[data-mobile-open]"),
        isOpen: () => mobileOpen,
        setOpen: (value) => (mobileOpen = value),
    });
</script>

<svelte:window
    onkeydown={(event) => {
        // Ctrl+B left, Ctrl+Alt+B right (like vscode)
        if (
            event.code === "KeyB" &&
            (event.ctrlKey || event.metaKey) &&
            !event.shiftKey &&
            event.altKey === (side === "right")
        ) {
            event.preventDefault();
            setOpen(!open);
        }
    }}
/>

<div
    {@attach swipe.backdrop}
    class="sidebar-backdrop bg-black/30"
    data-mobile-open={mobileOpen || undefined}
    data-dragging={swipe.progress !== null || undefined}
    style:--progress={swipe.progress ?? undefined}
    aria-hidden="true"
    onclick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        mobileOpen = false;
    }}
></div>

<aside
    {@attach swipe.panel}
    class={[
        "sidebar flex shrink-0 flex-col bg-background",
        side === "left" ? "border-r" : "border-l",
    ]}
    aria-label="{side} sidebar"
    data-mobile-open={mobileOpen || undefined}
    data-desktop-open={desktopOpen || undefined}
    data-dragging={swipe.progress !== null || undefined}
    data-switching={switching || undefined}
    data-side={side}
    style:--progress={swipe.progress ?? undefined}
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
            bind:open={() => open, setOpen}
            {side}
            class={["absolute", side === "left" ? "right-2.5" : "left-2.5"]}
        />
    </header>

    <div class="relative w-full grow">
        <div
            class="sidebar-contents flex size-full flex-col overflow-y-auto overscroll-contain p-2"
        >
            {@render children()}
        </div>
    </div>
</aside>

<style>
    .sidebar-backdrop,
    .sidebar {
        --drawer-ease: cubic-bezier(0, 0, 0.2, 1); /* tw ease-out */
    }

    .sidebar-backdrop {
        display: none;
    }

    /* Shared */
    .sidebar {
        top: 0;
        height: 100dvh;

        .sidebar-contents {
            position: absolute;
            top: 0;
            right: 0;
        }
    }

    /* Mobile & tablet */
    @media (width < 64rem) {
        .sidebar-backdrop {
            display: block;
            inset: 0;
            z-index: 99;
            position: fixed;
            touch-action: pinch-zoom;
            pointer-events: none;
            visibility: hidden;
            opacity: var(--progress, 0);
            transition:
                opacity 250ms var(--drawer-ease),
                visibility 250ms;

            &[data-mobile-open] {
                --progress: 1;
                pointer-events: auto;
                visibility: visible;
                transition-duration: 350ms;
            }
            &[data-dragging] {
                pointer-events: auto;
                visibility: visible;
                transition: none;
            }
        }

        .sidebar {
            position: fixed;
            z-index: 100;
            width: min(calc(var(--spacing) * 120), 100% - var(--spacing) * 12);
            overscroll-behavior: contain;
            /* we handle horizontal swipes ourselves */
            touch-action: pan-y pinch-zoom;

            transform: translateX(calc((1 - var(--progress, 0)) * var(--direction) * 100%));
            visibility: hidden;
            transition:
                transform 250ms var(--drawer-ease),
                visibility 250ms;

            &[data-side="left"] {
                left: 0;
                --direction: -1;
            }
            &[data-side="right"] {
                right: 0;
                --direction: 1;
            }

            &[data-mobile-open] {
                --progress: 1;
                visibility: visible;
                transition-duration: 350ms;
            }
            &[data-dragging] {
                visibility: visible;
                transition: none;
            }
        }
    }

    /* Desktop */
    @media (width >= 64rem) {
        .sidebar {
            --sidebar-width: calc(var(--spacing) * 80);
            width: var(--sidebar-width);
            transition: width 150ms ease-in-out;

            .sidebar-toolbar,
            .sidebar-contents {
                transition: visibility 150ms ease-in-out allow-discrete;
                visibility: visible;
            }
            .sidebar-contents {
                transition:
                    visibility 150ms ease-in-out allow-discrete,
                    opacity 150ms ease-in-out;
                opacity: 1;
                /* stops the contents from squishing as it dissapears */
                min-width: var(--sidebar-width);
            }
            &:not([data-desktop-open]) {
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

    .sidebar[data-switching],
    .sidebar[data-switching] .sidebar-toolbar,
    .sidebar[data-switching] .sidebar-contents {
        transition: none;
    }

    @media (prefers-reduced-motion: reduce) {
        .sidebar-backdrop,
        .sidebar,
        .sidebar-toolbar,
        .sidebar-contents {
            transition-duration: 0.01ms !important;
        }
    }
</style>
