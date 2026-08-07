import { Field } from "formik";

const InputSearchBarComponent = ({ placeholder = 'Buscar...', value, disabled, name, styles }) => {
    return (
        <div className='w-full relative'>
            <Field
                id={name}
                value={value}
                name={name}
                type={"text"}
                placeholder={placeholder}
                className={`w-full bg-gray-100 rounded-lg inset-shadow-custom p-2 pl-10 font-bold text-gray-600
                    focus:outline-none focus:ring-2 focus:ring-blue-800 ${styles}`}
                disabled={disabled}
            />
            <i className='absolute text-gray-500 pi pi-search left-2 top-3'></i>
        </div>
    )
}

export default InputSearchBarComponent;