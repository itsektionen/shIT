"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onLongPress = onLongPress;
function onLongPress(holdTime, callback) {
    return function (element) {
        var timer;
        var isLongPress = false;
        var start = function (event) {
            if (event.pointerType !== "touch")
                return;
            isLongPress = false;
            timer = setTimeout(function () {
                isLongPress = true;
                callback();
            }, holdTime);
        };
        var preventClick = function (event) {
            if (!isLongPress)
                return;
            event.stopImmediatePropagation();
            event.preventDefault();
            isLongPress = false;
        };
        var cancel = function () { return clearTimeout(timer); };
        element.addEventListener("pointerdown", start);
        element.addEventListener("pointerup", cancel);
        element.addEventListener("pointermove", cancel);
        element.addEventListener("pointercancel", cancel);
        element.addEventListener("click", preventClick, { capture: true });
        return function () {
            element.removeEventListener("pointerdown", start);
            element.removeEventListener("pointerup", cancel);
            element.removeEventListener("pointermove", cancel);
            element.removeEventListener("pointercancel", cancel);
            element.removeEventListener("click", preventClick, { capture: true });
            cancel();
        };
    };
}
//# sourceMappingURL=longpress.js.map