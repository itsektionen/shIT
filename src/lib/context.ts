import { createContext } from "svelte";

export const [getScriptsContext, setScriptsContext] = createContext<{
    paths: string[] | undefined;
}>();
