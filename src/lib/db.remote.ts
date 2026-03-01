import { command, form, query } from "$app/server";
import { desc, eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { buttonTable, collectionTable } from "$lib/server/db/schema";
import * as vb from "valibot";
import { fail, redirect } from "@sveltejs/kit";
import { editSchema } from "./components/ButtonEditModal.svelte";

export const getCollections = query(async () => {
    return await db.select().from(collectionTable);
});
export const createCollection = form(
    vb.object({
        label: vb.string(),
    }),
    async (data) => {
        const result = await db.insert(collectionTable).values(data).returning();
        await getCollections().refresh();
        redirect(303, `/col/${result[0].id}`);
    },
);

export const getButtons = query(vb.string(), async (collectionId) => {
    return await db
        .select()
        .from(buttonTable)
        .where(eq(buttonTable.collectionId, collectionId))
        .orderBy(buttonTable.order);
});
export const createButton = form(
    vb.object({
        collectionId: vb.string(),
        scriptPath: vb.string(),
    }),
    async ({ collectionId, scriptPath }) => {
        const result = await db.transaction(async (tx) => {
            const lastButtonOrder = await tx
                .select()
                .from(buttonTable)
                .where(eq(buttonTable.collectionId, collectionId))
                .orderBy(desc(buttonTable.order))
                .limit(1)
                .then((res) => res[0]?.order ?? -1);

            return await tx
                .insert(buttonTable)
                .values({
                    collectionId: collectionId,
                    script: scriptPath,
                    label: scriptPath
                        .split("/")
                        .slice(-1)[0]
                        .replace(/\.[^/.]+$/, ""),
                    order: lastButtonOrder + 1,
                })
                .returning()
                .then((res) => res[0]);
        });

        await getButtons(collectionId).refresh();
        return {
            success: true,
            data: result,
        };
    },
);

export const editButton = form(editSchema, async ({ id, action, ...newData }) => {
    console.log("Editing button", { id, action, newData });
    
    // FIXME: Transaction to prevent race conditions
    const button = await db
        .select()
        .from(buttonTable)
        .where(eq(buttonTable.id, id))
        .then((res) => res[0]);
    if (!button) {
        return fail(404, { message: "Button not found" });
    }

    switch (action) {
        case "update":
            await db.update(buttonTable).set(newData).where(eq(buttonTable.id, id));
            break;
        case "delete":
            await db.delete(buttonTable).where(eq(buttonTable.id, id));
            break;
    }
});
export const reorderButtons = command(vb.array(vb.string()), async (orderedIds) => {
    await db.transaction(async (tx) => {
        for (let i = 0; i < orderedIds.length; i++) {
            await tx.update(buttonTable).set({ order: i }).where(eq(buttonTable.id, orderedIds[i]));
        }
    });
});
