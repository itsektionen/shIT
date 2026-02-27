import { getCollections } from "$lib/server/db/operations";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ params }) => {
    const collections = await getCollections();
    const currentCollection = collections.find((c) => c.id === params.collection);

    if (params.collection && !currentCollection) {
        throw redirect(302, "/");
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
