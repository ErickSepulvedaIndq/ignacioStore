import { Toaster, ToastBar, toast } from "react-hot-toast";
import { useState } from "react";

const SwipeableToast = ({ t }) => {
    const [startX, setStartX] = useState(null);
    const [offset, setOffset] = useState(0);
    const isDragging = startX !== null;

    const handleStart = (x) => setStartX(x);

    const handleMove = (x) => {
        if (startX === null) return;
        setOffset(x - startX);
    };

    const handleEnd = () => {
        if (Math.abs(offset) > 80) toast.dismiss(t.id);
        setStartX(null);
        setOffset(0);
    };

    return (
        <div
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX)}
            onTouchEnd={handleEnd}
            onTouchCancel={handleEnd}
            style={{
                transform: `translateX(${offset}px)`,
                opacity: 1 - Math.min(Math.abs(offset) / 150, 0.85),
                transition: isDragging ? "none" : "transform .2s, opacity .2s",
                touchAction: "pan-y",
            }}
        >
            <ToastBar toast={t} />
        </div>
    );
};

export default function SwipeableToaster(props) {
    return <Toaster {...props}>{(t) => <SwipeableToast t={t} />}</Toaster>;
}