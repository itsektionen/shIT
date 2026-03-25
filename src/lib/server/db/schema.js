"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buttonTable = exports.collectionTable = void 0;
var sqlite_core_1 = require("drizzle-orm/sqlite-core");
exports.collectionTable = (0, sqlite_core_1.sqliteTable)("collection", function (t) { return ({
    id: t
        .text()
        .primaryKey()
        .$defaultFn(function () { return crypto.randomUUID(); }),
    label: t.text().notNull(),
    color: t.text(),
}); });
exports.buttonTable = (0, sqlite_core_1.sqliteTable)("button", function (t) { return ({
    id: t
        .text()
        .primaryKey()
        .notNull()
        .$defaultFn(function () { return crypto.randomUUID(); }),
    collectionId: t
        .text()
        .notNull()
        .references(function () { return exports.collectionTable.id; }, { onDelete: "cascade" }),
    script: t.text().notNull(),
    label: t.text().notNull(),
    color: t.text(),
    iconId: t.text(),
    // Used to determine the order of buttons within a collection
    order: t.integer().notNull(),
}); }, function (t) { return [
    // Optimise the most common query (getting the buttons in a collection)
    (0, sqlite_core_1.index)("collectionId_idx").on(t.collectionId),
]; });
//# sourceMappingURL=schema.js.map