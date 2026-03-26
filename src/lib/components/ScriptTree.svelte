<script lang="ts" module>
    interface TreeFile {
        name: string;
        path: string;
        type: "file";
    }
    interface TreeDirectory {
        name: string;
        type: "directory";
        children: (TreeFile | TreeDirectory)[];
    }
    type TreeNode = TreeFile | TreeDirectory;
</script>

<script lang="ts">
    import FileIcon from "@iconify-svelte/material-symbols/description-rounded";
    import FolderClosedIcon from "@iconify-svelte/material-symbols/folder-rounded";
    import FolderOpenIcon from "@iconify-svelte/material-symbols/folder-open-rounded";
    import AddIcon from "@iconify-svelte/material-symbols/add-2-rounded";

    import { SvelteMap } from "svelte/reactivity";
    import ScriptTree from "./ScriptTree.svelte";
    import { runScript } from "$lib/lmixer.remote";
    import { createButton } from "$lib/db.remote";
    import { getCollectionContext } from "$lib/context";

    function constructTree(paths: string[]): TreeNode[] {
        const tree: TreeNode[] = [];

        for (const filePath of paths) {
            const parts = filePath.split("/");
            let parentChildren: TreeNode[] = tree;
            for (const segment of parts.slice(0, -1)) {
                let node: TreeNode | undefined = parentChildren.find((c) => c.name === segment);
                if (!node) {
                    node = {
                        name: segment,
                        type: "directory",
                        children: [],
                    } satisfies TreeDirectory;
                    parentChildren.push(node);
                }
                if (node.type !== "directory")
                    throw new Error(`Expected ${node.name} to be a directory`);
                parentChildren = node.children;
            }
            const fileName = parts[parts.length - 1];
            if (parentChildren.some((c) => c.name === fileName))
                throw new Error(`Duplicate file name: ${filePath}`);
            parentChildren.push({
                name: fileName,
                path: filePath,
                type: "file",
            });
        }
        // Recursive sort to make directories come before files, then sort alphabetically
        function sortNodes(nodes: TreeNode[]) {
            nodes.sort((a, b) => {
                if (a.type === b.type) return a.name.localeCompare(b.name);
                return a.type === "directory" ? -1 : 1;
            });
            for (const node of nodes) {
                if (node.type === "directory") {
                    sortNodes(node.children);
                }
            }
        }
        sortNodes(tree);

        return tree;
    }

    let {
        isRoot = true,
        pathPrefix = "",
        expandAll = false,
        ...props
    }: {
        isRoot?: boolean;
        pathPrefix?: string;
        expandAll?: boolean;
    } & ({ scriptPaths: string[] } | { scriptTree: TreeNode[] }) = $props();

    let processedTree: TreeNode[] = $derived(
        "scriptTree" in props
            ? props.scriptTree
            : constructTree(
                  props.scriptPaths.map((p) => {
                      if (p.startsWith(pathPrefix)) return p.slice(pathPrefix.length);
                      console.warn(`Path ${p} does not start with prefix ${pathPrefix}`);
                      return p;
                  }),
              ),
    );
    let nodeExpansions = new SvelteMap<string, boolean>();
    let collection = getCollectionContext();
</script>

<!-- TODO: Turn into an accessible tree view. Requires some effort for to-spec keyboard navigation though -->
<ul class="flex flex-col" role={isRoot ? "tree" : "group"}>
    {#each processedTree as node (node.name)}
        {@const shouldExpand = nodeExpansions.get(node.name) ?? expandAll}
        {#if node.type === "directory"}
            <li class="flex flex-col" data-expanded={shouldExpand}>
                <button
                    class={[
                        "flex size-full items-center gap-1 p-0.5",
                        "hover:bg-secondary focus:bg-secondary",
                        "border-secondary pointer-coarse:border-b pointer-coarse:py-2",
                        !expandAll && "cursor-pointer",
                    ]}
                    onclick={() => {
                        nodeExpansions.set(node.name, !shouldExpand);
                    }}
                >
                    {#if shouldExpand}
                        <FolderOpenIcon class="size-[1lh] shrink-0 opacity-50" />
                    {:else}
                        <FolderClosedIcon class="size-[1lh] shrink-0 opacity-50" />
                    {/if}
                    <span class="truncate">{node.name}/</span>
                </button>
                {#if shouldExpand}
                    <div class="border-l pl-[0.8lh]">
                        <ScriptTree scriptTree={node.children} isRoot={false} {expandAll} />
                    </div>
                {/if}
            </li>
        {:else}
            <li class="flex flex-row items-center gap-1 border-secondary pointer-coarse:border-b">
                <button
                    data-path={node.path}
                    class={[
                        "flex grow flex-row items-center gap-1 truncate p-0.5",
                        "cursor-grab hover:bg-secondary focus:bg-secondary",
                        "pointer-coarse:py-2",
                    ]}
                    onclick={() => {
                        runScript(node.path);
                    }}
                    draggable="true"
                    ondragstart={(event) => {
                        if (!event.dataTransfer) return;
                        event.dataTransfer.effectAllowed = "link";
                        // Used by the main button area to load scripts as buttons.
                        event.dataTransfer.setData("lmixer/script", node.path);
                    }}
                >
                    <FileIcon class="size-[1lh] opacity-50" />
                    <span class="truncate">{node.name}</span>
                </button>
                <!-- Touch-friendly add button -->
                {#if collection.current}
                    <button
                        class={[
                            "size-8 p-0.5 not-pointer-coarse:hidden",
                            "bg-secondary hover:bg-secondary/60 focus:bg-secondary/60",
                        ]}
                        onclick={() => {
                            if (!collection.current) {
                                console.error("Tried adding script to null collection");
                                return;
                            }
                            createButton({
                                collectionId: collection.current.id,
                                scriptPath: node.path,
                            });
                        }}
                    >
                        <AddIcon class="size-full" />
                    </button>
                {/if}
            </li>
        {/if}
    {/each}
</ul>
