import { error } from "console";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
    const { currentCollection, ...data } = await parent();

    if (!currentCollection) {
        error(404, { message: "Collection not found" });
    }

    return {
        currentCollection: currentCollection as NonNullable<typeof currentCollection>,
        ...data,
    };
};
