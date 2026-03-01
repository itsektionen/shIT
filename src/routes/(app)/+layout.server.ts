import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { getCollections } from "$lib/db.remote";

export const load: LayoutServerLoad = async ({ params }) => {
    const collections = await getCollections();
    const currentCollection = collections.find((c) => c.id === params.collection);

    if (params.collection && !currentCollection) {
        error(404, { message: "Collection not found" });
    }

    // TODO: Unmockify
    const scriptPaths = [
        "scripts/bar.lua",
        "scripts/baz/qux.lua",
        "scripts/baz/quux.lua",
        "scripts/baz/corge/grault.lua",
    ];

    return { collections, currentCollection, scriptPaths };
};
