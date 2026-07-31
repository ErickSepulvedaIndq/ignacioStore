import { useState } from "react";
import toast from "react-hot-toast";

const InputNumberShoppingCart = ({ currentQuantity, stock, onChange }) => {
    const [inputValue, setInputValue] = useState(currentQuantity);

    const handleValue = (value) => {
        let numValue = parseInt(value);

        if (numValue === 0) numValue = 1;

        if (numValue > stock) {
            toast(<div className="flex flex-col">
                <p className="font-semibold">Unidades máximas disponibles</p>
                <p>{`${stock} unidades.`}</p>
            </div>, {
                icon: <i className="pi pi-info-circle text-2xl text-amber-500"></i>,
            });
            setInputValue(stock);
            onChange(stock);
            return;
        }

        setInputValue(numValue);
        if (value === "" || isNaN(value)) return;
        onChange(numValue);
    };

    const handleOnBlur = (value) => {
        if (value === "" || isNaN(value)) setInputValue(1);
    }

    return (
        <input
            type="number"
            value={inputValue}
            onBlur={(e) => handleOnBlur(e.target.value)}
            onChange={(e) => handleValue(e.target.value)}
            min="1"
            max={stock}

            className="inset-shadow-custom rounded px-3 text-black py-2 w-16 cursor-pointer"
        />
    )

}

export default InputNumberShoppingCart;