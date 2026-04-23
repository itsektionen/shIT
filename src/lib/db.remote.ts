import { command, form, query } from "$app/server";
import { desc, eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { buttonTable, collectionTable } from "$lib/server/db/schema";
import * as vb from "valibot";
import { redirect } from "@sveltejs/kit";
import path from "path";
import { buttonEditSchema, collectionEditSchema } from "$lib/schemas";

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
export const editCollection = form(collectionEditSchema, async ({ id, ...newData }) => {
    await db.update(collectionTable).set(newData).where(eq(collectionTable.id, id));
    await getCollections().refresh();
});
export const deleteCollection = command(vb.string(), async (id) => {
    await db.delete(collectionTable).where(eq(collectionTable.id, id));
    await getCollections().refresh();
});

export const getButtons = query(vb.string(), async (collectionId) => {
    return await db
        .select()
        .from(buttonTable)
        .where(eq(buttonTable.collectionId, collectionId))
        .orderBy(buttonTable.order);
});

export const createButton = command(
    vb.object({
        collectionId: vb.string(),
        scriptPath: vb.string(),
    }),
    async ({ collectionId, scriptPath }) => {
        const parsedPath = path.parse(scriptPath);
        const defaultName = parsedPath.name
            // Title case after underscores/dashes
            .split(/[_-]/)
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ");

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
                    label: defaultName,
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
export const editButton = form(buttonEditSchema, async ({ id, ...newData }) => {
    const collectionId = await db.transaction(async (tx) => {
        const button = await tx
            .select()
            .from(buttonTable)
            .where(eq(buttonTable.id, id))
            .then((res) => res[0]);

        if (!button) return null;
        await tx.update(buttonTable).set(newData).where(eq(buttonTable.id, id));
        return button.collectionId;
    });
    if (collectionId) {
        await getButtons(collectionId).refresh();
    }
    return { success: collectionId !== null };
});
export const reorderButtons = command(vb.array(vb.string()), async (orderedIds) => {
    await db.transaction(async (tx) => {
        for (let i = 0; i < orderedIds.length; i++) {
            await tx.update(buttonTable).set({ order: i }).where(eq(buttonTable.id, orderedIds[i]));
        }
    });
});
export const deleteButton = command(vb.string(), async (id) => {
    const collectionId = await db.transaction(async (tx) => {
        const button = await tx
            .select()
            .from(buttonTable)
            .where(eq(buttonTable.id, id))
            .then((res) => res[0]);
        if (!button) return null;
        await tx.delete(buttonTable).where(eq(buttonTable.id, id));
        return button.collectionId;
    });
    if (collectionId) {
        await getButtons(collectionId).refresh();
    }
});
