import * as vb from "valibot";

export const collectionEditSchema = vb.object({
    id: vb.string(),
    label: vb.pipe(vb.string(), vb.trim(), vb.minLength(1)),
    color: vb.optional(vb.string()),
});

export const buttonEditSchema = vb.object({
    id: vb.string(),
    script: vb.pipe(vb.string(), vb.trim(), vb.minLength(1)),
    label: vb.pipe(vb.string(), vb.trim(), vb.minLength(1)),
    color: vb.optional(vb.string()),
    iconId: vb.optional(vb.string()),
});
