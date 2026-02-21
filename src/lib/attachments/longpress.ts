import type { Attachment } from "svelte/attachments";

export function onLongPress(holdTime: number, callback: () => void): Attachment<HTMLElement> {
    return (element) => {
        let timer: ReturnType<typeof setTimeout>;
        let isLongPress = false;

        const start = (event: PointerEvent) => {
            if (event.pointerType !== "touch") return;
            isLongPress = false;
            timer = setTimeout(() => {
                isLongPress = true;
                callback();
            }, holdTime);
        };
        const preventClick = (event: MouseEvent) => {
            if (!isLongPress) return;
            event.stopImmediatePropagation();
            event.preventDefault();
            isLongPress = false;
        };
        const cancel = () => clearTimeout(timer);

        element.addEventListener("pointerdown", start);
        element.addEventListener("pointerup", cancel);
        element.addEventListener("pointermove", cancel);
        element.addEventListener("pointercancel", cancel);
        element.addEventListener("click", preventClick, { capture: true });

        return () => {
            element.removeEventListener("pointerdown", start);
            element.removeEventListener("pointerup", cancel);
            element.removeEventListener("pointermove", cancel);
            element.removeEventListener("pointercancel", cancel);
            element.removeEventListener("click", preventClick, { capture: true });
            cancel();
        };
    };
}
