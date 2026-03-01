import { index, sqliteTable } from "drizzle-orm/sqlite-core";

export const collectionTable = sqliteTable("collection", (t) => ({
    id: t
        .text()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    label: t.text().notNull(),
    color: t.text(),
}));

export const buttonTable = sqliteTable(
    "button",
    (t) => ({
        id: t
            .text()
            .primaryKey()
            .notNull()
            .$defaultFn(() => crypto.randomUUID()),
        collectionId: t
            .text()
            .notNull()
            .references(() => collectionTable.id, { onDelete: "cascade" }),
        script: t.text().notNull(),
        label: t.text().notNull(),
        color: t.text(),
        iconId: t.text(),
        // Used to determine the order of buttons within a collection
        order: t.integer().notNull(),
    }),
    (t) => [
        // Optimise the most common query (getting the buttons in a collection)
        index("collectionId_idx").on(t.collectionId),
    ],
);
