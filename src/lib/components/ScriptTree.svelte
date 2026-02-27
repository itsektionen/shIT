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
    import { SvelteSet } from "svelte/reactivity";
    import ScriptTree from "./ScriptTree.svelte";

    import FileIcon from "@iconify-svelte/material-symbols/description-rounded";
    import FolderClosedIcon from "@iconify-svelte/material-symbols/folder-rounded";
    import FolderOpenIcon from "@iconify-svelte/material-symbols/folder-open-rounded";

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
        ...props
    }: {
        isRoot?: boolean;
        pathPrefix?: string;
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

    let expandedNodes = new SvelteSet();
    // If we only have a single node, make it expanded by default
    $effect(() => {
        if (processedTree.length === 1 && processedTree[0].type === "directory") {
            expandedNodes.add(processedTree[0].name);
        }
    });
</script>

<!-- TODO: Turn into an accessible tree view. Requires some effort for to-spec keyboard navigation though -->
<ul class="flex flex-col" role={isRoot ? "tree" : "group"}>
    {#each processedTree as node (node.name)}
        {#if node.type === "directory"}
            <li class="flex flex-col" data-expanded={expandedNodes.has(node.name)}>
                <button
                    class="flex p-0.5 size-full cursor-pointer items-center gap-1 hover:bg-secondary"
                    onclick={() => {
                        if (expandedNodes.has(node.name)) {
                            expandedNodes.delete(node.name);
                        } else {
                            expandedNodes.add(node.name);
                        }
                    }}
                >
                    {#if expandedNodes.has(node.name)}
                        <FolderOpenIcon class="size-[1lh] opacity-50" />
                    {:else}
                        <FolderClosedIcon class="size-[1lh] opacity-50" />
                    {/if}
                    {node.name}/
                </button>
                {#if expandedNodes.has(node.name)}
                    <div class="border-l pl-[0.8lh]">
                        <ScriptTree scriptTree={node.children} isRoot={false} />
                    </div>
                {/if}
            </li>
        {:else}
            <li>
                <button
                    data-path={node.path}
                    class="flex p-0.5 size-full cursor-grab items-center gap-1 hover:bg-secondary"
                    onclick={() => {
                        console.log("File clicked:", node.path);
                    }}
                    draggable="true"
                >
                    <FileIcon class="size-[1lh] opacity-50" />
                    {node.name}
                </button>
            </li>
        {/if}
    {/each}
</ul>
