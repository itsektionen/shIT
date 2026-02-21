<script lang="ts">
    import LabelIcon from "@iconify-svelte/material-symbols/text-fields";
    import IconIcon from "@iconify-svelte/material-symbols/image-rounded";
    import ColorIcon from "@iconify-svelte/material-symbols/colorize-rounded";
    import ClearColorIcon from "@iconify-svelte/material-symbols/format-color-reset-rounded";
    import ColorPaletteIcon from "@iconify-svelte/material-symbols/palette";

    import type { Attachment } from "svelte/attachments";
    import ScriptButton, { type Button } from "./ScriptButton.svelte";
    import Icon from "@iconify/svelte";

    let formButton = $state<Button | undefined>(undefined);
    let resolvePromise: ((value: Button | null | undefined) => void) | undefined = undefined;

    export function edit(button: Button): Promise<Button | null | undefined> {
        formButton = $state.snapshot(button);
        return new Promise((resolve) => {
            resolvePromise = resolve; // So that we can resolve it outside of this function
        });
    }
    const modalAttachment: Attachment<HTMLDialogElement> = (element) => {
        element.showModal();
        return () => element.close();
    };
    function closeWith(value: Button | null | undefined) {
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

    // Checks the user-agent to see if it is Windows 10 Firefox
    function IsFirefoxOnWindows() {
        const navigatorAgent = navigator.userAgent;
        // eslint somehow thinks that \. is the same as . in regex
        // eslint-disable-next-line no-useless-escape
        const checkingRegex =
            /^Mozilla\/\d\.\d \(Windows NT \d\d\.\d;.+\) Gecko\/(\d+) Firefox\/[\d\.]+$/;
        return checkingRegex.exec(navigatorAgent) !== null;
    }

    const isFirefox = IsFirefoxOnWindows();

    const colorPalette: { value: string; name: string }[] = [
        // Greyscale
        { value: "#000000", name: "Black" },
        { value: "#777777", name: "Grey" },
        { value: "#ffffff", name: "White" },
        // Laserviolet :)
        { value: "#cc99ff", name: "Laserviolet" },
        // Tailwind primaries
        { value: "#ff6467", name: "Red" },
        { value: "#ff8903", name: "Orange" },
        { value: "#ffb900", name: "Amber" },
        { value: "#fdc700", name: "Yellow" },
        { value: "#9ae600", name: "Lime" },
        { value: "#06df72", name: "Green" },
        { value: "#40f5bc", name: "Emerald" },
        { value: "#00d5bd", name: "Teal" },
        { value: "#00d3f2", name: "Cyan" },
        { value: "#00bcff", name: "Sky" },
        { value: "#51a2ff", name: "Blue" },
        { value: "#7c86ff", name: "Indigo" },
        { value: "#a684ff", name: "Violet" },
        { value: "#c27aff", name: "Purple" },
        { value: "#ed6bff", name: "Fuchsia" },
        { value: "#fb64b6", name: "Pink" },
        { value: "#ff637e", name: "Rose" },
    ];
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
                {#if isFirefox}
                    <fieldset aria-labelledby="sample-color-legend">
                        <div class="gap1 flex items-center font-semibold">
                            <ColorPaletteIcon class="size-[1lh]" />
                            <legend id="sample-color-legend" class="grow">Sample Colors</legend>
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
                        <div role="none" class="mx-auto grid grid-cols-7 justify-center-safe">
                            {#each colorPalette as colorEntry}
                                <button
                                    class={[
                                        "relative aspect-square cursor-pointer rounded-lg border",
                                        formButton.color == colorEntry.value
                                            ? "border-brand!"
                                            : "border-transparent!",
                                    ]}
                                    aria-label={colorEntry.name}
                                    onclick={() => {
                                        if (formButton) formButton.color = colorEntry.value;
                                    }}
                                >
                                    <div
                                        role="none"
                                        style={"background-color:" + colorEntry.value}
                                        class="absolute inset-1 rounded-sm"
                                    ></div>
                                </button>
                            {/each}
                        </div>
                    </fieldset>
                    <div class="flex items-center gap-1 font-semibold">
                        <ColorIcon class="size-[1lh]" />
                        <span class="grow">Color Picker</span>
                    </div>
                {:else}
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
                {/if}
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
                    {#each colorPalette as colorEntry}
                        <option value={colorEntry.value}>{colorEntry.name}</option>
                    {/each}
                </datalist>
            </div>

            <div class="flex gap-2">
                <button
                    onclick={() => closeWith(null)}
                    class="rounded bg-red-400 px-2 py-1 text-black"
                >
                    Delete
                </button>
                <div class="grow"></div>
                <button
                    onclick={() => closeWith(null)}
                    class="rounded bg-zinc-400 px-2 py-1 text-black"
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
