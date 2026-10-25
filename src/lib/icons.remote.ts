import { query } from "$app/server";
import * as vb from "valibot";
import { findIcons, resolveIcon } from "#lib/server/icons.js";

export const getIcon = query.batch(vb.string(), async (icons) => {
    const data = new Map(
        await Promise.all(icons.map(async (icon) => [icon, await resolveIcon(icon)] as const)),
    );
    return (icon) => data.get(icon) ?? null;
});

export const searchIcons = query(
    vb.object({ prefix: vb.string(), query: vb.string() }),
    ({ prefix, query }) => findIcons(prefix, query, 64),
);
