import { error } from "console";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
    const parentData = await parent();

    if (!parentData.currentCollection) {
        error(404, { message: "Collection not found" });
    }

    return { ...parentData };
};
