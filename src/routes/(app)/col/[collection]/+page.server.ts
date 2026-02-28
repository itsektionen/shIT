import { getButtons, addCollection, addButton } from "$lib/server/db/operations";
import { fail, redirect } from "@sveltejs/kit";
import { dev } from "$app/environment";
import type { Actions, PageServerLoad } from "./$types";
import { resolve } from "$app/paths";

export const load: PageServerLoad = async ({ parent }) => {
    const { currentCollection, ...parentData } = await parent();
    const buttons = currentCollection ? await getButtons(currentCollection.id) : undefined;
    return { ...parentData, currentCollection, buttons };
};

export const actions = {
    addCollection: async ({ request }) => {
        if (dev) await new Promise((fulfil) => setTimeout(fulfil, 1000)); // Simulate latency in dev mode

        const formData = await request.formData();
        const label = formData.get("label");
        if (typeof label !== "string") {
            return fail(400, { label, error: "Label must exist and be a string" });
        }
        const created = await addCollection({ label });

        redirect(302, resolve(`/col/${created.id}`));
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
