<script lang="ts" module>
    import * as vb from "valibot";
    export const buttonEditSchema = vb.object({
        id: vb.string(),
        script: vb.pipe(vb.string(), vb.trim(), vb.minLength(1)),
        label: vb.pipe(vb.string(), vb.trim(), vb.minLength(1)),
        color: vb.optional(vb.string()),
        iconId: vb.optional(vb.string()),
    });
</script>

<script lang="ts">
    import LabelIcon from "@iconify-svelte/material-symbols/text-fields";
    import IconIcon from "@iconify-svelte/material-symbols/image-rounded";
    import ColorIcon from "@iconify-svelte/material-symbols/colorize-rounded";
    import ScriptIcon from "@iconify-svelte/material-symbols/code-rounded";

    import ScriptButton from "./ScriptButton.svelte";
    import type { buttonTable } from "$lib/server/db/schema";
    import IconSearchResults from "./IconSearchResults.svelte";
    import { deleteButton, editButton, getButtons } from "$lib/db.remote";
    import Icon from "@iconify/svelte";
    import { getScriptsContext } from "$lib/context";

    type Button = typeof buttonTable.$inferSelect;
    const uid = $props.id();

    let activeButton = $state<Button | undefined>(undefined);
    export function edit(button: Button) {
        activeButton = $state.snapshot(button);
        editButton.fields.set({
            id: button.id,
            script: button.script,
            label: button.label,
            color: button.color ?? undefined,
            iconId: button.iconId ?? undefined,
        });
    }

    const ICON_PREFIX = "mdi";
    function iconNameFromId(iconId: string) {
        return iconId.replace(new RegExp(`^${ICON_PREFIX}:`), "");
    }
    function iconIdFromName(name: string) {
        return name ? `${ICON_PREFIX}:${name}` : "";
    }

    let scripts = getScriptsContext();

    const colors = [
        ["#000000", "Black"],
        ["#777777", "Grey"],
        ["#ffffff", "White"],
        [],
        ["#ff6467", "Red"],
        ["#ff8904", "Orange"],
        ["#fcc800", "Yellow"],
        ["#9ae600", "Lime"],
        ["#05df72", "Green"],
        ["#00d5be", "Teal"],
        ["#00bcff", "Sky"],
        ["#cc99ff", "Laserviolet"],
        ["#e83d84", "Rosa"],
        [],
        ["#cc99ff", "Laserviolet"],
        ["#44687d", "Silicone blue"],
        ["#acff5b", "ITK Green"],
        ["#800000", "QMISK Ockraröd"],
        ["#004791", "KTH-Blue"],
        ["#45b8da", "THS-Blue"],
        ["#a2ee8d", "TBas Green"],
    ] as const;
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
            {...editButton.preflight(buttonEditSchema).enhance(async ({ form, data, submit }) => {
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
                    <span class="text-red-400">*</span>
                </label>
                {#each editButton.fields.label.issues() as issue, i (i)}
                    <span class="text-sm text-red-400">{issue.message}</span>
                {/each}
                <input
                    {...editButton.fields.label.as("text")}
                    id="{uid}-label"
                    bind:value={
                        () => activeButton?.label ?? "",
                        (value) => {
                            if (activeButton) activeButton.label = value;
                        }
                    }
                    class="w-full"
                    autocomplete="off"
                    minlength="1"
                    pattern=".*\S.*"
                    required
                />
            </div>
            {#each editButton.fields.iconId.issues() as issue, i (i)}
                <span class="text-sm text-red-400">{issue.message}</span>
            {/each}

            <!-- Icon field -->
            <div class="flex flex-col gap-1">
                <label for="{uid}-icon" class="flex items-center gap-1 font-semibold">
                    <IconIcon class="size-[1lh]" />
                    <span>Icon</span>
                </label>
                {#each editButton.fields.iconId.issues() as issue, i (i)}
                    <span class="text-sm text-red-400">{issue.message}</span>
                {/each}
                <div class="group relative">
                    <!-- a hidden input to pass the value to the form. prevents having to expose the prefix to the user -->
                    <input
                        {...editButton.fields.iconId.as("hidden", "text")}
                        value={activeButton.iconId?.trim() || ""}
                    />
                    <div class="group relative" style:--size="calc(var(--spacing) * 2 + 1lh)">
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
                            class="w-full pr-8 focus-visible:[&+*]:text-brand"
                            autocomplete="off"
                        />
                        <div
                            class={[
                                "flex size-(--size) items-center justify-center",
                                "absolute top-1/2 right-0 -translate-y-1/2 text-border",
                            ]}
                        >
                            <Icon icon={activeButton.iconId ?? ""} class="size-(--size)" />
                        </div>
                    </div>
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
                </label>
                {#each editButton.fields.color.issues() as issue, i (i)}
                    <span class="text-sm text-red-400">{issue.message}</span>
                {/each}
                <div class="flex flex-wrap">
                    <button
                        type="button"
                        title="Default"
                        class={[
                            "m-0.5 size-6 cursor-pointer rounded border-2 bg-secondary",
                            activeButton.color === null ? "border-brand" : "",
                        ]}
                        onclick={() => {
                            if (activeButton) activeButton.color = null;
                        }}
                    >
                    </button>

                    <div
                        class={[
                            "rainbow-gradient relative m-0.5 size-6 rounded border-2",
                            activeButton?.color &&
                            !colors.some(([color]) => color === activeButton?.color)
                                ? "border-brand"
                                : "",
                        ]}
                    >
                        <input
                            id="{uid}-color"
                            {...editButton.fields.color.as("color")}
                            class="absolute inset-0 size-full cursor-pointer opacity-0"
                            title="Custom"
                            value={activeButton.color ?? "#000000"}
                            oninput={(event) => {
                                if (activeButton) activeButton.color = event.currentTarget.value;
                            }}
                        />
                    </div>

                    {#each colors as [color, name], i (i)}
                        {#if color}
                            <button
                                type="button"
                                title={name}
                                class={[
                                    "m-0.5 size-6 cursor-pointer rounded border-2",
                                    activeButton.color === color ? "border-brand" : "",
                                ]}
                                style:background-color={color}
                                onclick={() => {
                                    if (activeButton) activeButton.color = color;
                                }}
                            >
                            </button>
                        {:else}
                            <div class="w-full shrink"></div>
                        {/if}
                    {/each}
                </div>
            </div>

            <!-- Script field -->
            <div class="flex flex-col gap-1">
                <label for="{uid}-script" class="flex items-center gap-1 font-semibold">
                    <ScriptIcon class="size-[1lh]" />
                    <span>Script path</span>
                    <span class="text-red-400">*</span>
                </label>
                {#each editButton.fields.script.issues() as issue, i (i)}
                    <span class="text-sm text-red-400">{issue.message}</span>
                {/each}
                <input
                    {...editButton.fields.script.as("text")}
                    id="{uid}-script"
                    class="w-full invalid:text-red-400"
                    autocomplete="off"
                    minlength="1"
                    pattern=".*\S.*"
                    required
                    oninput={(event) => {
                        // Validate with the built-in constraints
                        event.currentTarget.setCustomValidity("");
                        if (!event.currentTarget.validity.valid) return;

                        // Validate the script path as the user types and show errors immediately
                        const value = event.currentTarget.value;
                        if (!scripts.paths?.includes(value)) {
                            event.currentTarget.setCustomValidity("Script not found");
                        }
                        event.currentTarget.reportValidity();
                    }}
                />
            </div>

            <!-- Action buttons -->
            <div class="flex justify-end gap-2">
                <button
                    type="button"
                    class="bg-red-400 px-2 py-1 text-black"
                    onclick={() => {
                        if (activeButton) {
                            deleteButton(activeButton.id).updates(
                                getButtons(activeButton.collectionId),
                            );
                        }
                        activeButton = undefined;
                    }}
                >
                    Delete
                </button>
                <button
                    type="button"
                    class="bg-gray-400 px-2 py-1 text-black"
                    onclick={() => {
                        activeButton = undefined;
                    }}
                >
                    Cancel
                </button>
                <button type="submit" class="bg-green-400 px-2 py-1 text-black"> Save </button>
            </div>
        </form>
    </dialog>
{/if}

<style>
    .rainbow-gradient {
        background: conic-gradient(in oklch longer hue, oklch(0.75 0.12 0), oklch(0.75 0.12 0));
    }
</style>
