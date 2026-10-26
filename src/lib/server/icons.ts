import { getIconData } from "@iconify/utils";
import fuzzysort from "fuzzysort";

type IconSet = Parameters<typeof getIconData>[0];

// icon packs by their prefix
// to add more just install @iconify-json/<prefix> and add a line
const packs = new Map<string, () => Promise<{ default: IconSet }>>([
    ["mdi", () => import("@iconify-json/mdi/icons.json")],
]);

// iconify kebab-case "prefix:name"
const ICON_PATTERN = /^([a-z0-9]+(?:-[a-z0-9]+)*):([a-z0-9]+(?:-[a-z0-9]+)*)$/;

export async function resolveIcon(icon: string) {
    const match = ICON_PATTERN.exec(icon);
    const loadPack = match && packs.get(match[1]);
    if (!loadPack) return null;
    return getIconData((await loadPack()).default, match[2]);
}

export async function findIcons(prefix: string, query: string, limit: number) {
    const loadPack = packs.get(prefix);
    let term = query.trim().toLowerCase();
    // the query may be a full "prefix:name"
    if (term.startsWith(`${prefix}:`)) term = term.slice(prefix.length + 1);
    if (!loadPack || !term) return [];
    const { icons, aliases } = (await loadPack()).default;
    const names = [...Object.keys(icons), ...Object.keys(aliases ?? {})];
    return fuzzysort.go(term, names, { limit }).map((result) => `${prefix}:${result.target}`);
}
