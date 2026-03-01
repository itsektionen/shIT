<script lang="ts">
    import { resolve } from "$app/paths";
    import { page } from "$app/state";
    import HomeIcon from "@iconify-svelte/material-symbols/keyboard-return-rounded";
    import RetryIcon from "@iconify-svelte/material-symbols/refresh-rounded";

    const codeColors: Record<number, string | undefined> = {
        200: "#9ae600",
        300: "#c27aff",
        400: "#ff6467",
        500: "#ff8904",
    };
</script>

<svelte:head>
    <title>shIT Error {page.status}</title>
</svelte:head>

<div class="flex h-full flex-col items-center justify-center">
    <p>Oh shIT.</p>
    <h1 class="text-8xl" style:color={codeColors[Math.floor(page.status / 100) * 100]}>
        {page.status}
    </h1>
    <p class="text-xl">{page.error?.message}</p>

    <div class="flex flex-row gap-8">
        {#if page.status !== 404}
            <button
                class="mt-2 flex flex-row items-center gap-1 font-semibold"
                onclick={() => window.location.reload()}
            >
                <RetryIcon class="size-[1lh]" />
                Retry
            </button>
        {/if}

        <a class="mt-2 flex flex-row items-center gap-1 font-semibold" href={resolve("/")}>
            <HomeIcon class="size-[1lh]" />
            Go Home
        </a>
    </div>
</div>
