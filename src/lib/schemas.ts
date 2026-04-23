import * as vb from "valibot";

export const collectionFormSchema = vb.object({
    id: vb.string(),
    label: vb.pipe(vb.string(), vb.trim(), vb.minLength(1)),
    color: vb.union([
        vb.pipe(vb.string(), vb.regex(vb.HEX_COLOR_REGEX, "Invalid color format")),
        vb.literal(""),
    ]),
});
export const buttonFormSchema = vb.object({
    id: vb.string(),
    script: vb.pipe(vb.string(), vb.trim(), vb.minLength(1)),
    label: vb.pipe(vb.string(), vb.trim(), vb.minLength(1)),
    color: vb.union([
        vb.pipe(vb.string(), vb.regex(vb.HEX_COLOR_REGEX, "Invalid color format")),
        vb.literal(""),
    ]),
    iconId: vb.string(), // empty string = null
});
