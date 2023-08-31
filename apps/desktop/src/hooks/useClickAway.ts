import { useRef, useLayoutEffect, useEffect } from "react";

export default (cb: () => void) => {
    const ref = useRef(null);
    const refCb = useRef(cb);

    useLayoutEffect(() => {
        refCb.current = cb;
    });

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault?.()
            const element: any = ref.current;
            if (element && !element.contains(e.target)) {
                refCb.current();
            }
        };

        document.addEventListener("mousedown", handler);
        document.addEventListener("touchstart", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("touchstart", handler);
        };
    }, []);

    return ref;
}