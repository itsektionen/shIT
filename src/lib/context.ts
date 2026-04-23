import { createContext } from "svelte";
import type { collectionTable } from "./server/db/schema";

export const [getCollectionContext, setCollectionContext] = createContext<{
    current: typeof collectionTable.$inferSelect | undefined;
}>();

export const [getScriptsContext, setScriptsContext] = createContext<{
    paths: string[] | undefined;
}>();

export const [getEditModeContext, setEditModeContext] = createContext<{
    isEditing: boolean;
}>();

export const confirmScriptExecution = (scriptName: string) => {
    const key = "confirmScriptExecution";
    if (sessionStorage.getItem(key) === "true") {
        return true;
    }
    const confirmed = confirm(`Run ${scriptName}?`);
    if (confirmed) {
        sessionStorage.setItem(key, "true");
    }
    return confirmed;
};
