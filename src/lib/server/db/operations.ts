import { eq } from "drizzle-orm";
import { db } from ".";
import { buttonTable, collectionTable } from "./schema";

export async function getCollections() {
    return await db.select().from(collectionTable);
}

export async function getButtons(collectionId: string) {
    return await db
        .select()
        .from(buttonTable)
        .where(eq(buttonTable.collectionId, collectionId))
        .orderBy(buttonTable.order);
}

export async function addCollection(data: { label: string; color?: string }) {
    const result = await db
        .insert(collectionTable)
        .values({
            label: data.label,
            color: data.color,
        })
        .returning();
    return result[0];
}

export async function addButton(data: { collectionId: string; script: string }) {
    const buttonsInCollection = await db
        .select()
        .from(buttonTable)
        .where(eq(buttonTable.collectionId, data.collectionId))
        .orderBy(buttonTable.order);

    const result = await db
        .insert(buttonTable)
        .values({
            collectionId: data.collectionId,
            label: "New Button",
            script: data.script,
            order: buttonsInCollection.length,
        })
        .returning();
    return result[0];
}
