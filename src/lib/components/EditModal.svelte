<script lang="ts">
    import LabelIcon from "@iconify-svelte/material-symbols/text-fields";
    import IconIcon from "@iconify-svelte/material-symbols/image-rounded";
    import ColorIcon from "@iconify-svelte/material-symbols/colorize-rounded";
    import ClearColorIcon from "@iconify-svelte/material-symbols/format-color-reset-rounded";

    import type { Attachment } from "svelte/attachments";
    import ScriptButton, { type Button } from "./ScriptButton.svelte";
    import Icon from "@iconify/svelte";

    let formButton = $state<Button | undefined>(undefined);
    let resolvePromise: ((value: Button | undefined) => void) | undefined = undefined;

    export function edit(button: Button): Promise<Button | undefined> {
        formButton = $state.snapshot(button);
        return new Promise((resolve) => {
            resolvePromise = resolve; // So that we can resolve it outside of this function
        });
    }
    const modalAttachment: Attachment<HTMLDialogElement> = (element) => {
        element.showModal();
        return () => element.close();
    };
    function closeWith(value: Button | undefined) {
        resolvePromise?.(value);
        formButton = undefined;
    }

    const ICON_PREFIX = "mdi";
    let icons = $state<string[]>([]);
    let fetchTask = Promise.resolve();
    $effect(() => {
        const callbackQuery = formButton?.iconId ?? "";
        const timeout = setTimeout(async () => {
            if (!callbackQuery) {
                icons = [];
                return;
            }
            // Wait for the previous to finish
            await fetchTask;
            // We are in an outdated callback. Make way for a newer one.
            if (callbackQuery !== formButton?.iconId) return;
            fetchTask = fetch(
                `https://api.iconify.design/search?${new URLSearchParams({
                    query: callbackQuery,
                    limit: "10",
                    prefix: ICON_PREFIX,
                }).toString()}`,
            )
                .then((res) => res.json())
                .then((data) => {
                    icons = data.icons || [];
                })
                .catch((error) => {
                    console.error("Failed to fetch icons:", error);
                });
        }, 500);

        return () => clearTimeout(timeout);
    });
</script>

{#if formButton}
    <dialog
        {@attach modalAttachment}
        closedby="any"
        onclose={() => closeWith(undefined)}
        style:width="min(calc(var(--spacing) * 90), 100%)"
        class={[
            "bg-transparent text-foreground select-none",
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible",
            "backdrop:bg-black/40 backdrop:backdrop-blur-sm",
        ]}
    >
        <div class="pointer-events-none flex w-full justify-center">
            <div class="rounded-t border-2 border-b-0 bg-background p-4 shadow-xl">
                <ScriptButton btn={formButton} onEdit={undefined} />
            </div>
        </div>

        <div class={["rounded border-2 bg-background p-4 shadow-xl", "flex flex-col gap-4"]}>
            <h2 class="text-xl font-semibold">Edit Button</h2>

            <div class="flex flex-col gap-1">
                <div class="flex items-center gap-1 font-semibold">
                    <LabelIcon class="size-[1lh]" />
                    <span>Label</span>
                </div>
                <input
                    name="Button label"
                    bind:value={formButton.label}
                    type="text"
                    class="w-full"
                />
            </div>
            <div class="flex flex-col gap-1">
                <div class="flex items-center gap-1 font-semibold">
                    <IconIcon class="size-[1lh]" />
                    <span>Icon</span>
                </div>
                <div class="group relative">
                    <input
                        name="Button icon"
                        bind:value={
                            () => (formButton?.iconId ?? "").replace(`${ICON_PREFIX}:`, ""),
                            (value) => {
                                if (formButton) formButton.iconId = `${ICON_PREFIX}:${value}`;
                            }
                        }
                        type="text"
                        class="peer w-full"
                        list="icon-suggestions"
                        autocomplete="off"
                    />
                    <!-- a datalist doesn't cut it here so we roll our own :/ -->
                    <div
                        class={[
                            "absolute top-full left-0 z-10 max-h-60 w-full flex-col overflow-y-auto bg-secondary",
                            "hidden group-focus-within:flex",
                        ]}
                    >
                        {#each icons.length === 1 && icons[0] === formButton?.iconId ? [] : icons as icon (icon)}
                            <button
                                class="flex items-center gap-2 px-2 py-1 hover:bg-brand/20"
                                onclick={() => {
                                    if (formButton) formButton.iconId = icon;
                                }}
                            >
                                <Icon {icon} />
                                <span>{icon.replace(`${ICON_PREFIX}:`, "")}</span>
                            </button>
                        {/each}
                    </div>
                </div>
            </div>
            <div class="flex flex-col gap-1">
                <div class="flex items-center gap-1 font-semibold">
                    <ColorIcon class="size-[1lh]" />
                    <span class="grow">Color</span>
                    <button
                        class="icon-button size-[1lh] shrink-0"
                        aria-label="Clear color"
                        onclick={() => {
                            if (formButton) formButton.color = undefined;
                        }}
                    >
                        <ClearColorIcon />
                    </button>
                </div>
                <div
                    class="relative h-10 w-full border"
                    style:background={formButton.color ?? "var(--color-secondary)"}
                >
                    <input
                        name="Button color"
                        value={formButton.color ?? "#808080"}
                        oninput={(event) => {
                            if (formButton) formButton.color = event.currentTarget.value;
                        }}
                        type="color"
                        class="absolute inset-0 size-full cursor-pointer opacity-0"
                        list="color-suggestions"
                    />
                </div>

                <datalist id="color-suggestions">
                    <!-- Greyscale -->
                    <option value="#000000">Black</option>
                    <option value="#777777">Grey</option>
                    <option value="#ffffff">White</option>
                    <!-- Laserviolet :) -->
                    <option value="#cc99ff">Laserviolet</option>
                    <!-- Tailwind primaries -->
                    <option value="#ff6467">Red</option>
                    <option value="#ff8903">Orange</option>
                    <option value="#ffb900">Amber</option>
                    <option value="#fdc700">Yellow</option>
                    <option value="#9ae600">Lime</option>
                    <option value="#06df72">Green</option>
                    <option value="#40f5bc">Emerald</option>
                    <option value="#00d5bd">Teal</option>
                    <option value="#00d3f2">Cyan</option>
                    <option value="#00bcff">Sky</option>
                    <option value="#51a2ff">Blue</option>
                    <option value="#7c86ff">Indigo</option>
                    <option value="#a684ff">Violet</option>
                    <option value="#c27aff">Purple</option>
                    <option value="#ed6bff">Fuchsia</option>
                    <option value="#fb64b6">Pink</option>
                    <option value="#ff637e">Rose</option>
                </datalist>
            </div>

            <div class="flex justify-end gap-2">
                <button
                    onclick={() => closeWith(undefined)}
                    class="rounded bg-red-400 px-2 py-1 text-black"
                >
                    Cancel
                </button>
                <button
                    onclick={() => closeWith(formButton)}
                    class="rounded bg-brand px-2 py-1 text-brand-foreground"
                >
                    Save
                </button>
            </div>
        </div>
    </dialog>
{/if}
