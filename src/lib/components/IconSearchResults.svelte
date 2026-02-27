<script lang="ts">
    import Icon from "@iconify/svelte";

    let {
        icon = $bindable(),
        iconPrefix,
        debounce = 300,
    }: {
        icon: string;
        iconPrefix: string;
        debounce?: number;
    } = $props();

    async function fetchIcons(query: string, count: number = 64): Promise<string[]> {
        if (!query) return [];
        try {
            const response = await fetch(
                `https://api.iconify.design/search?${new URLSearchParams({
                    query,
                    prefix: iconPrefix,
                    limit: count.toString(),
                }).toString()}`,
            );
            const data = await response.json();
            return data.icons || [];
        } catch (error) {
            console.error("Failed to fetch icons:", error);
            return [];
        }
    }

    let fetchedIcons = $state<string[]>([]);
    let fetchTask = Promise.resolve();
    $effect(() => {
        const thisQuery = icon;
        const timeout = setTimeout(async () => {
            if (!thisQuery) {
                fetchedIcons = [];
                return;
            }
            // Wait for the previous to finish
            await fetchTask;
            // We are in an outdated callback. Make way for a newer one.
            if (thisQuery !== icon) return;

            fetchTask = fetchIcons(thisQuery).then((icons) => {
                fetchedIcons = icons;
                // Showing the icon that is already selected is redundant
                if (fetchedIcons.length === 1 && fetchedIcons[0] === icon) {
                    fetchedIcons = [];
                }
            });
        }, debounce);

        return () => clearTimeout(timeout);
    });
</script>

{#each fetchedIcons as ico (ico)}
    <button
        class="flex items-center gap-2 px-2 py-1 hover:bg-brand/20"
        onclick={() => {
            icon = ico;
        }}
        type="button"
    >
        <Icon icon={ico} />
        <span>{ico.replace(new RegExp(`^${iconPrefix}:`), "")}</span>
    </button>
{/each}
