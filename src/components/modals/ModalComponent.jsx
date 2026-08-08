import { useEffect, useState } from "react";

const ModalComponent = ({ children, onClose, title, iconStyles, isOpen, childrenStyles }) => {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [isVisible, setIsVisible] = useState(false);
    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

    if (isOpen !== prevIsOpen) {
        setPrevIsOpen(isOpen);
        if (isOpen) {
            setShouldRender(true);
        } else {
            setIsVisible(false);
        }
    }

    useEffect(() => {
        if (!isOpen) return;

        let frame2;
        const frame1 = requestAnimationFrame(() => {
            frame2 = requestAnimationFrame(() => setIsVisible(true));
        });

        return () => {
            cancelAnimationFrame(frame1);
            cancelAnimationFrame(frame2);
        };
    }, [isOpen]);

    const handleTransitionEnd = (e) => {
        if (e.target !== e.currentTarget) return;
        if (!isOpen) setShouldRender(false);
    };

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 transition-opacity duration-100 ease-out ${isVisible ? "opacity-100" : "opacity-0"}`}
            onTransitionEnd={handleTransitionEnd}
        >
            <div className={`bg-blue-900 shadow-custom-xl rounded-2xl w-fit p-2 relative transition-all duration-100 ease-out ${isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 -translate-y-4"}`}>

                <div className="flex justify-between bg-blue-900 rounded-t-2xl py-3 px-2 items-center">
                    <div className="flex flex-row gap-3 items-center justify-center">
                        <i className={`pi text-white text-shadow-lg text-2xl md:text-2xl ${iconStyles}`}></i>
                        <h2 className="text-2xl font-bold text-white text-shadow-lg">
                            {title}
                        </h2>
                    </div>
                    <button
                        className="text-white text-xl md:text-2xl transition cursor-pointer hover:scale-120 hover:text-red-500"
                        title="Cerrar"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <div className={`bg-white p-4 rounded-lg inset-shadow-custom ${childrenStyles}`}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default ModalComponent;