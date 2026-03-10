import { createContext } from "svelte";
import type { collectionTable } from "./server/db/schema";

export const [getCollectionContext, setCollectionContext] = createContext<{
    current: typeof collectionTable.$inferSelect | undefined;
}>();

export const [getScriptsContext, setScriptsContext] = createContext<{
    paths: string[] | undefined;
}>();
