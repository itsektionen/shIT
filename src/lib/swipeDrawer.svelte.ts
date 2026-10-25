// px moved before gesture direction is decided
const GESTURE_THRESHOLD = 8;
// px/ms
const FLING_VELOCITY = 0.4;
// ms still before release means it isn't a fling
const FLING_IDLE = 100;

interface Gesture {
    mode: "open" | "close";
    id: number;
    startX: number;
    startY: number;
    lastX: number;
    lastTime: number;
    velocity: number;
    panelWidth: number;
    locked: boolean;
}

export function createDrawerSwipe(options: {
    side: () => "left" | "right";
    enabled: () => boolean;
    canOpen: () => boolean;
    isOpen: () => boolean;
    setOpen: (open: boolean) => void;
}) {
    // 0 closed, 1 open, null not dragging
    let progress = $state<number | null>(null);

    let backdrop: HTMLElement | undefined;
    function attachBackdrop(node: HTMLElement) {
        backdrop = node;
        return () => (backdrop = undefined);
    }

    function attachPanel(panel: HTMLElement) {
        if (!options.enabled()) return;

        const sign = options.side() === "left" ? 1 : -1;
        let gesture: Gesture | null = null;

        const reset = () => {
            gesture = null;
            progress = null;
        };

        function onTouchStart(event: TouchEvent) {
            // a second finger is a pinch, not a swipe
            if (event.touches.length > 1) return reset();
            const touch = event.touches[0];

            let mode: Gesture["mode"] | undefined;
            if (options.isOpen()) {
                const target = event.target as Node;
                if (panel.contains(target) || backdrop?.contains(target)) mode = "close";
            } else if (options.canOpen()) {
                mode = "open";
            }
            if (!mode) return;

            gesture = {
                mode,
                id: touch.identifier,
                startX: touch.clientX,
                startY: touch.clientY,
                lastX: touch.clientX,
                lastTime: event.timeStamp,
                velocity: 0,
                panelWidth: panel.offsetWidth,
                locked: false,
            };
        }

        function onTouchMove(event: TouchEvent) {
            if (!gesture) return;
            const touch = [...event.touches].find((t) => t.identifier === gesture!.id);
            if (!touch) return;
            let dx = (touch.clientX - gesture.startX) * sign;
            const dy = touch.clientY - gesture.startY;

            if (!gesture.locked) {
                if (Math.abs(dx) < GESTURE_THRESHOLD && Math.abs(dy) < GESTURE_THRESHOLD) return;
                // skip vertical or wrong way drags
                const wrongWay = gesture.mode === "open" ? dx < 0 : dx > 0;
                if (Math.abs(dy) > Math.abs(dx) || wrongWay) {
                    gesture = null;
                    return;
                }
                gesture.locked = true;
                gesture.startX = touch.clientX;
                dx = 0;
            }

            if (event.cancelable) event.preventDefault();

            const elapsed = event.timeStamp - gesture.lastTime;
            if (elapsed > 0) {
                gesture.velocity = ((touch.clientX - gesture.lastX) * sign) / elapsed;
            }
            gesture.lastX = touch.clientX;
            gesture.lastTime = event.timeStamp;

            const offset = gesture.mode === "open" ? dx : gesture.panelWidth + dx;
            progress = Math.min(1, Math.max(0, offset / gesture.panelWidth));
        }

        function onTouchEnd(event: TouchEvent) {
            // another finger lifting doesn't end it
            if (!gesture || ![...event.changedTouches].some((t) => t.identifier === gesture!.id))
                return;
            if (gesture.locked && progress !== null) {
                const velocity =
                    event.timeStamp - gesture.lastTime > FLING_IDLE ? 0 : gesture.velocity;
                const flung = Math.abs(velocity) > FLING_VELOCITY;
                options.setOpen(flung ? velocity > 0 : progress > 0.5);
            }
            reset();
        }

        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("touchend", onTouchEnd);
        window.addEventListener("touchcancel", reset);
        return () => {
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
            window.removeEventListener("touchcancel", reset);
            reset();
        };
    }

    return {
        get progress() {
            return progress;
        },
        panel: attachPanel,
        backdrop: attachBackdrop,
    };
}
