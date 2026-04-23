<script lang="ts">
    import LabelIcon from "@iconify-svelte/material-symbols/text-fields";
    import IconIcon from "@iconify-svelte/material-symbols/image-rounded";
    import ColorIcon from "@iconify-svelte/material-symbols/colorize-rounded";
    import ScriptIcon from "@iconify-svelte/material-symbols/code-rounded";

    import type { buttonTable } from "$lib/server/db/schema";
    import IconSearchResults from "../IconSearchResults.svelte";
    import { deleteButton, editButton as editButtonForm, getButtons } from "$lib/db.remote";
    import { buttonFormSchema } from "$lib/schemas";
    import Icon from "@iconify/svelte";
    import { getScriptsContext } from "$lib/context";
    import ScriptButton from "../buttons/ScriptButton.svelte";
    import { onMount } from "svelte";
    import ColorSelector from "../ColorSelector.svelte";

    type Button = typeof buttonTable.$inferSelect;
    const uid = $props.id();

    let {
        button: passedButton,
        onclose,
    }: {
        button: Button;
        onclose: () => void;
    } = $props();

    onMount(() => {
        editButtonForm.fields.set({
            id: passedButton.id,
            script: passedButton.script,
            label: passedButton.label,
            color: passedButton.color ?? "",
            iconId: passedButton.iconId ?? "",
        });
    });

    const ICON_PREFIX = "mdi";
    function iconNameFromId(iconId: string) {
        return iconId.replace(new RegExp(`^${ICON_PREFIX}:`), "");
    }
    function iconIdFromName(name: string) {
        return name ? `${ICON_PREFIX}:${name}` : "";
    }

    let scripts = getScriptsContext();
</script>

<dialog
    {@attach (element) => {
        element.showModal();
        return () => element.close();
    }}
    closedby="any"
    onclose={() => onclose()}
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
            <ScriptButton
                btn={{
                    ...passedButton,
                    ...editButtonForm.fields.value(),
                }}
                onEdit={undefined}
            />
        </div>
    </div>

    <form
        {...editButtonForm.preflight(buttonFormSchema).enhance(async ({ data, submit }) => {
            await submit().updates(
                getButtons(passedButton.collectionId).withOverride((btns) =>
                    btns.map((btn) => (btn.id === passedButton.id ? { ...btn, ...data } : btn)),
                ),
            );
            onclose();
        })}
        class={["border-2 bg-background p-4 shadow-xl", "flex flex-col gap-4"]}
    >
        <h2 class="text-xl font-semibold">Edit Button</h2>

        <input {...editButtonForm.fields.id.as("hidden", passedButton.id)} />

        <!-- Label field -->
        <div class="flex flex-col gap-1">
            <label for="{uid}-label" class="flex items-center gap-1 font-semibold">
                <LabelIcon class="size-[1lh]" />
                <span>Label</span>
                <span class="text-red-400">*</span>
            </label>
            {#each editButtonForm.fields.label.issues() as issue, i (i)}
                <span class="text-sm text-red-400">{issue.message}</span>
            {/each}
            <input
                {...editButtonForm.fields.label.as("text")}
                id="{uid}-label"
                class="w-full"
                autocomplete="off"
                minlength="1"
                pattern=".*\S.*"
                required
            />
        </div>

        <!-- Icon field -->
        <div class="flex flex-col gap-1">
            <label for="{uid}-icon" class="flex items-center gap-1 font-semibold">
                <IconIcon class="size-[1lh]" />
                <span>Icon</span>
            </label>
            {#each editButtonForm.fields.iconId.issues() as issue, i (i)}
                <span class="text-sm text-red-400">{issue.message}</span>
            {/each}
            <div class="group relative">
                <!-- a hidden input to pass the value to the form. prevents having to expose the prefix to the user -->
                <input {...editButtonForm.fields.iconId.as("text")} class="hidden" />
                <div class="group relative" style:--size="calc(var(--spacing) * 2 + 1lh)">
                    <!-- Real input the user will use -->
                    <input
                        type="text"
                        bind:value={
                            () => iconNameFromId(editButtonForm.fields.iconId.value() ?? ""),
                            (value) => {
                                editButtonForm.fields.iconId.set(iconIdFromName(value));
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
                        <Icon
                            icon={editButtonForm.fields.iconId.value() ?? ""}
                            class="size-(--size)"
                        />
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
                            () => editButtonForm.fields.iconId.value() ?? "",
                            (value) => {
                                editButtonForm.fields.iconId.set(value);
                            }
                        }
                        iconPrefix={ICON_PREFIX}
                    />
                </div>
            </div>
        </div>

        <!-- Color field -->
        <div class="flex flex-col gap-1">
            <!-- FIXME: Clicking on the label does not focus the arbitrary color input -->
            <label class="flex items-center gap-1 font-semibold">
                <ColorIcon class="size-[1lh]" />
                <span class="grow">Color</span>
            </label>
            {#each editButtonForm.fields.color.issues() as issue, i (i)}
                <span class="text-sm text-red-400">{issue.message}</span>
            {/each}
            <ColorSelector field={editButtonForm.fields.color} />
        </div>

        <!-- Script field -->
        <div class="flex flex-col gap-1">
            <label for="{uid}-script" class="flex items-center gap-1 font-semibold">
                <ScriptIcon class="size-[1lh]" />
                <span>Script path</span>
                <span class="text-red-400">*</span>
            </label>
            {#each editButtonForm.fields.script.issues() as issue, i (i)}
                <span class="text-sm text-red-400">{issue.message}</span>
            {/each}
            <input
                {...editButtonForm.fields.script.as("text")}
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
                    deleteButton(passedButton.id).updates(getButtons(passedButton.collectionId));
                    onclose();
                }}
            >
                Delete
            </button>
            <button
                type="button"
                class="bg-gray-400 px-2 py-1 text-black"
                onclick={() => {
                    onclose();
                }}
            >
                Cancel
            </button>
            <button type="submit" class="bg-green-400 px-2 py-1 text-black"> Save </button>
        </div>
    </form>
</dialog>
