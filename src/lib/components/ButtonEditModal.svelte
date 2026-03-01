<script lang="ts" module>
    import * as vb from "valibot";
    export const editSchema = vb.object({
        id: vb.string(),
        action: vb.picklist(["update", "delete"]),
        label: vb.pipe(vb.string(), vb.trim(), vb.minLength(1)),
        color: vb.optional(vb.string()),
        iconId: vb.optional(vb.string()),
    });
</script>

<script lang="ts">
    import LabelIcon from "@iconify-svelte/material-symbols/text-fields";
    import IconIcon from "@iconify-svelte/material-symbols/image-rounded";
    import ColorIcon from "@iconify-svelte/material-symbols/colorize-rounded";
    import ClearColorIcon from "@iconify-svelte/material-symbols/format-color-reset-rounded";

    import ScriptButton from "./ScriptButton.svelte";
    import type { buttonTable } from "$lib/server/db/schema";
    import IconSearchResults from "./IconSearchResults.svelte";
    import { editButton, getButtons } from "$lib/db.remote";

    type Button = typeof buttonTable.$inferSelect;
    const uid = $props.id();

    let activeButton = $state<Button | undefined>(undefined);
    export function edit(button: Button) {
        activeButton = $state.snapshot(button);
    }

    const ICON_PREFIX = "mdi";
    function iconNameFromId(iconId: string) {
        return iconId.replace(new RegExp(`^${ICON_PREFIX}:`), "");
    }
    function iconIdFromName(name: string) {
        return name ? `${ICON_PREFIX}:${name}` : "";
    }
</script>

{#if activeButton !== undefined}
    <dialog
        {@attach (element) => {
            element.showModal();
            return () => element.close();
        }}
        closedby="closerequest"
        onclose={() => {
            activeButton = undefined;
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
                <ScriptButton btn={activeButton} onEdit={undefined} />
            </div>
        </div>

        <form
            {...editButton.preflight(editSchema).enhance(async ({ form, data, submit }) => {
                const active = $state.snapshot(activeButton);
                if (!active) return;
                form.reset();
                activeButton = undefined;
                await submit().updates(
                    getButtons(active.collectionId).withOverride((btns) =>
                        btns.map((btn) => (btn.id === active?.id ? { ...btn, ...data } : btn)),
                    ),
                );
            })}
            class={["border-2 bg-background p-4 shadow-xl", "flex flex-col gap-4"]}
        >
            <h2 class="text-xl font-semibold">Edit Button</h2>

            <input {...editButton.fields.id.as("hidden", "text")} value={activeButton.id} />

            <!-- Label field -->
            <div class="flex flex-col gap-1">
                <label for="{uid}-label" class="flex items-center gap-1 font-semibold">
                    <LabelIcon class="size-[1lh]" />
                    <span>Label</span>
                </label>
                {#each editButton.fields.label.issues() as issue, i (i)}
                    <span class="text-sm text-red-500">{issue.message}</span>
                {/each}
                <input
                    {...editButton.fields.label.as("text")}
                    id="{uid}-label"
                    class="w-full"
                    autocomplete="off"
                    minlength="1"
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
                        {...editButton.fields.iconId.as("hidden", "text")}
                        value={activeButton.iconId?.trim() || "MEOW"}
                    />
                    <!-- Real input the user will use -->
                    <input
                        type="text"
                        bind:value={
                            () => iconNameFromId(activeButton?.iconId ?? ""),
                            (value) => {
                                if (activeButton) activeButton.iconId = iconIdFromName(value);
                            }
                        }
                        id="{uid}-icon"
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
                                () => activeButton?.iconId ?? "",
                                (value) => {
                                    if (activeButton) activeButton.iconId = value;
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
                    {#if activeButton.color}
                        <button
                            type="button"
                            class="bg-transparent p-1 text-foreground opacity-50 transition-opacity hover:opacity-100 focus:ring focus:outline-none"
                            onclick={() => {
                                if (activeButton) activeButton.color = null;
                            }}
                        >
                            <ClearColorIcon class="size-[1lh]" />
                        </button>
                    {/if}
                </label>
                <div
                    class="relative h-10 w-full border ring-brand focus-within:ring"
                    style:background={activeButton.color ?? "var(--color-secondary)"}
                >
                    <input
                        type="color"
                        value={activeButton.color || "#808080"}
                        oninput={(event) => {
                            if (activeButton) activeButton.color = event.currentTarget.value;
                        }}
                        id="{uid}-color"
                        class="absolute inset-0 size-full cursor-pointer opacity-0"
                        list="{uid}-color-suggestions"
                    />
                    <!-- Similar hack to be able to submit null colors -->
                    <input
                        {...editButton.fields.color.as("hidden", "text")}
                        value={activeButton.color || ""}
                    />
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
                <button
                    class="bg-red-400 px-2 py-1 text-black"
                    {...editButton.fields.action.as("submit", "delete")}
                >
                    Delete
                </button>
                <button
                    class="bg-gray-400 px-2 py-1 text-black"
                    onclick={() => {
                        activeButton = undefined;
                    }}
                >
                    Cancel
                </button>
                <button
                    class="bg-green-400 px-2 py-1 text-black"
                    {...editButton.fields.action.as("submit", "update")}
                >
                    Save
                </button>
            </div>
        </form>
    </dialog>
{/if}
