import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

const InputNumberShoppingCart = ({ currentQuantity, stock, onChange }) => {
    const [inputValue, setInputValue] = useState(currentQuantity);
    const isEditing = useRef(false);

    useEffect(() => {
        if (!isEditing.current) setInputValue(currentQuantity);
    }, [currentQuantity]);

    const handleValue = (value) => {
        if (value === "") {
            setInputValue("");
            return;
        }

        let numValue = parseInt(value, 10);
        if (isNaN(numValue)) return;
        if (numValue === 0) numValue = 1;

        if (numValue > stock) {
            toast(
                <div className="flex flex-col">
                    <p className="font-semibold">Unidades máximas disponibles</p>
                    <p>{`${stock} unidades.`}</p>
                </div>,
                { icon: <i className="pi pi-info-circle text-2xl text-amber-500"></i> }
            );
            setInputValue(stock);
            onChange(stock);
            return;
        }

        setInputValue(numValue);
        onChange(numValue);
    };

    const handleOnBlur = () => {
        isEditing.current = false;
        if (inputValue === "" || isNaN(inputValue)) {
            setInputValue(currentQuantity || 1);
        }
    };

    return (
        <input
            type="number"
            inputMode="numeric"
            value={inputValue}
            onFocus={() => (isEditing.current = true)}
            onBlur={handleOnBlur}
            onChange={(e) => handleValue(e.target.value)}
            min="1"
            max={stock}
            className="inset-shadow-custom rounded px-3 text-black py-2 w-16 cursor-pointer"
        />
    );
};

export default InputNumberShoppingCart;