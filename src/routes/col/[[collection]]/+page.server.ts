import { getCollections, getButtons, addCollection, addButton } from "$lib/server/db/operations";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { dev } from "$app/environment";

export const load: PageServerLoad = async ({ params }) => {
    const collections = await getCollections();
    const currentCollection = collections.find((c) => c.id === params.collection);
    const buttons = currentCollection ? await getButtons(currentCollection.id) : undefined;

    if (params.collection && !currentCollection) {
        throw redirect(302, "/col");
    }

    // TODO: Unmockify
    const scriptPaths = [
        "scripts/bar.lua",
        "scripts/baz/qux.lua",
        "scripts/baz/quux.lua",
        "scripts/baz/corge/grault.lua",
    ];

    return { collections, currentCollection, buttons, scriptPaths };
};

export const actions = {
    addCollection: async ({ request }) => {
        if (dev) await new Promise((fulfil) => setTimeout(fulfil, 1000)); // Simulate latency in dev mode

        const formData = await request.formData();
        console.log("Form data received:", Object.fromEntries(formData.entries()));
        const label = formData.get("label");
        if (typeof label !== "string") {
            return fail(400, { label, error: "Label must exist and be a string" });
        }
        const created = await addCollection({ label });
        console.log("Created collection:", created);
    },

    addButton: async ({ request }) => {
        if (dev) await new Promise((fulfil) => setTimeout(fulfil, 1000)); // Simulate latency in dev mode

        const formData = await request.formData();
        console.log("Form data received:", Object.fromEntries(formData.entries()));
        const collectionId = formData.get("collectionId");
        const script = formData.get("script");
        if (typeof collectionId !== "string") {
            return fail(400, { collectionId, error: "collectionId must exist and be a string" });
        }
        if (typeof script !== "string") {
            return fail(400, { script, error: "Script must exist and be a string" });
        }
        const created = await addButton({ collectionId, script });
        console.log("Created button:", created);
    },

    editButton: async ({ request }) => {
        if (dev) await new Promise((fulfil) => setTimeout(fulfil, 1000)); // Simulate latency in dev mode

        const formData = await request.formData();
        console.log("Form data received:", Object.fromEntries(formData.entries()));
    },
} satisfies Actions;
