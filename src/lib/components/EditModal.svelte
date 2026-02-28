<script lang="ts">
    import LabelIcon from "@iconify-svelte/material-symbols/text-fields";
    import IconIcon from "@iconify-svelte/material-symbols/image-rounded";
    import ColorIcon from "@iconify-svelte/material-symbols/colorize-rounded";
    import ClearColorIcon from "@iconify-svelte/material-symbols/format-color-reset-rounded";

    import ScriptButton from "./ScriptButton.svelte";
    import type { buttonTable } from "$lib/server/db/schema";
    import IconSearchResults from "./IconSearchResults.svelte";
    import { enhance } from "$app/forms";

    type Button = typeof buttonTable.$inferSelect;
    const uid = $props.id();

    let mockButton = $state<Button | undefined>(undefined);

    let resolvePromise: ((value: Button | null | undefined) => void) | undefined = undefined;

    export function edit(button: Button): Promise<Button | null | undefined> {
        mockButton = $state.snapshot(button);
        return new Promise((resolve) => {
            resolvePromise = resolve; // So that we can resolve it outside of this function
        });
    }

    const ICON_PREFIX = "mdi";
    function iconNameFromId(iconId: string) {
        return iconId.replace(new RegExp(`^${ICON_PREFIX}:`), "");
    }
    function iconIdFromName(name: string) {
        return name ? `${ICON_PREFIX}:${name}` : "";
    }
</script>

{#if mockButton !== undefined}
    <dialog
        {@attach (element) => {
            element.showModal();
            return () => element.close();
        }}
        closedby="any"
        onclose={() => {
            resolvePromise?.(mockButton);
            mockButton = undefined;
        }}
        style:width="min(calc(var(--spacing) * 90), 100%)"
        class={[
            "bg-transparent text-foreground select-none",
            "flex flex-col",
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible",
            "backdrop:bg-black/40 backdrop:backdrop-blur-sm",
        ]}
    >
        <div class="pointer-events-none flex w-full justify-center" inert>
            <div class="border-2 border-b-0 bg-background p-4 shadow-xl">
                <ScriptButton btn={mockButton} onEdit={undefined} />
            </div>
        </div>

        <form
            class={["border-2 bg-background p-4 shadow-xl", "flex flex-col gap-4"]}
            method="POST"
            action="?/editButton"
            use:enhance={(data) => {
                console.log(data);
            }}
        >
            <h2 class="text-xl font-semibold">Edit Button</h2>

            <!-- Label field -->
            <div class="flex flex-col gap-1">
                <label for="{uid}-label" class="flex items-center gap-1 font-semibold">
                    <LabelIcon class="size-[1lh]" />
                    <span>Label</span>
                </label>
                <input
                    id="{uid}-label"
                    name="label"
                    bind:value={mockButton.label}
                    type="text"
                    class="w-full"
                />
            </div>

            <!-- Icon field -->
            <div class="flex flex-col gap-1">
                <label for="{uid}-icon" class="flex items-center gap-1 font-semibold">
                    <IconIcon class="size-[1lh]" />
                    <span>Icon</span>
                </label>
                <div class="group relative">
                    <!-- a hidden input to pass the value to the form. prevents having to expose the prefix to the user -->
                    <input
                        name="icon"
                        value={mockButton.iconId?.trim() || "MEOW"}
                        type="text"
                        class="hidden"
                    />
                    <!-- Real input the user will use -->
                    <input
                        id="{uid}-icon"
                        bind:value={
                            () => iconNameFromId(mockButton?.iconId ?? ""),
                            (value) => {
                                if (mockButton) mockButton.iconId = iconIdFromName(value);
                            }
                        }
                        type="text"
                        class="w-full"
                        autocomplete="off"
                    />
                    <!-- a datalist doesn't cut it here so we roll our own :/ -->
                    <div
                        class={[
                            "absolute top-full left-0 z-10 max-h-60 w-full flex-col overflow-y-auto bg-secondary",
                            "hidden group-focus-within:flex",
                        ]}
                    >
                        <IconSearchResults
                            bind:icon={
                                () => mockButton?.iconId ?? "",
                                (value) => {
                                    if (mockButton) mockButton.iconId = value;
                                }
                            }
                            iconPrefix={ICON_PREFIX}
                        />
                    </div>
                </div>
            </div>

            <!-- Color field -->
            <div class="flex flex-col gap-1">
                <label for="{uid}-color" class="flex items-center gap-1 font-semibold">
                    <ColorIcon class="size-[1lh]" />
                    <span class="grow">Color</span>
                    {#if mockButton.color}
                        <button
                            type="button"
                            class="bg-transparent p-1 text-foreground opacity-50 transition-opacity hover:opacity-100 focus:ring focus:outline-none"
                            onclick={() => {
                                if (mockButton) mockButton.color = null;
                            }}
                        >
                            <ClearColorIcon class="size-[1lh]" />
                        </button>
                    {/if}
                </label>
                <div
                    class="relative h-10 w-full border ring-brand focus-within:ring"
                    style:background={mockButton.color ?? "var(--color-secondary)"}
                >
                    <input
                        id="{uid}-color"
                        value={mockButton.color || "#808080"}
                        oninput={(event) => {
                            if (mockButton) mockButton.color = event.currentTarget.value;
                        }}
                        type="color"
                        class="absolute inset-0 size-full cursor-pointer opacity-0"
                        list="{uid}-color-suggestions"
                    />
                    <!-- Similar hack to be able to submit null colors -->
                    <input name="color" value={mockButton.color || ""} type="text" class="hidden" />
                </div>
                <datalist id="{uid}-color-suggestions">
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
                <button class="bg-red-400 px-2 py-1 text-black" type="submit" formaction="?/delete">
                    Delete
                </button>
                <button
                    class="bg-gray-400 px-2 py-1 text-black"
                    onclick={() => {
                        resolvePromise?.(null);
                        mockButton = undefined;
                    }}
                >
                    Cancel
                </button>
                <button class="bg-green-400 px-2 py-1 text-black" type="submit"> Save </button>
            </div>
        </form>
    </dialog>
{/if}
