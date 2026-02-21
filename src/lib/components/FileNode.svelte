<script lang="ts" module>
    export interface FileTreeNode {
        path: string;
        type: "file" | "directory";
        children?: FileTreeNode[];
    }

    export function expandTree(flat: string[]): FileTreeNode[] {
        const tree: FileTreeNode[] = [];
        const pathMap = new Map<string, FileTreeNode>();

        for (const path of flat) {
            const parts = path.split("/");
            let currentPath = "";
            let parent: FileTreeNode | undefined;

            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                currentPath += (currentPath ? "/" : "") + part;
                if (!pathMap.has(currentPath)) {
                    const node: FileTreeNode = {
                        path: currentPath,
                        type: i === parts.length - 1 ? "file" : "directory",
                    };
                    pathMap.set(currentPath, node);
                    if (parent) {
                        parent.children ??= [];
                        parent.children.push(node);
                    } else {
                        tree.push(node);
                    }
                }
                parent = pathMap.get(currentPath)!;
            }
        }

        return tree;
    }
</script>

<script lang="ts">
    import { slide } from "svelte/transition";
    import RightArrow from "@iconify-svelte/material-symbols/arrow-right-rounded";
    import Self from "./FileNode.svelte";

    let { node }: { node: FileTreeNode } = $props();

    let isOpen = $state(false);

    let sortedChildren = $derived(
        [...(node.children ?? [])].sort((a, b) => {
            if (a.type === b.type) return a.path.localeCompare(b.path);
            return a.type === "directory" ? -1 : 1;
        }),
    );

    let name = $derived(node.path.split("/").pop() ?? "");
</script>

{#if node.type === "directory"}
    <button
        class="relative flex w-full cursor-pointer items-center py-0.5 hover:bg-secondary focus:z-10"
        onclick={() => (isOpen = !isOpen)}
    >
        <span
            class="flex size-5 shrink-0 items-center justify-center transition-transform duration-100"
            class:rotate-90={isOpen}
        >
            <RightArrow class="size-4" />
        </span>
        <span class="truncate font-bold">{name}</span>
    </button>

    {#if isOpen}
        <div
            transition:slide={{ duration: 150, axis: "y" }}
            class="ml-[calc(var(--spacing)*2.5-1px)] border-l border-black/10"
        >
            {#each sortedChildren as child (child.path)}
                <Self node={child} />
            {/each}
        </div>
    {/if}
{:else}
    <button
        class="relative flex cursor-pointer items-center py-0.5 pl-5 hover:bg-secondary focus:z-20"
        onclick={() => console.log("File clicked:", node.path)}
    >
        <span class="truncate opacity-80">{name}</span>
    </button>
{/if}
