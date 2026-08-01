import { ErrorMessage, Field } from "formik";
import { useState } from "react";

const CustomInputComponent = ({ label, name, type, placeholder, styles, value }) => {
    const [password, setPassword] = useState('password');

    return (
        <div className="w-full min-w-0 flex flex-col relative">
            <label className="font-bold text-gray-500 pl-1">{label}</label>
            <Field
                id={name}
                value={value}
                name={name}
                type={type === "password" ? password : type}
                placeholder={placeholder}
                className={`w-full bg-gray-100 rounded-lg inset-shadow-custom p-2 font-bold text-gray-600
                    focus:outline-none focus:ring-2 focus:ring-blue-800 pr-12 ${styles}`}
            />
            <div
                onClick={() => {
                    if (password === 'password') {
                        setPassword('text')
                    } else {
                        setPassword('password')
                    }
                }}
                title={password === "password" ? "Ver contraseña" : "Ocultar contraseña"}
                className={`${type === "password" ? "absolute top-6 right-0 h-10 w-10 flex justify-center items-center text-center cursor-pointer" : "hidden!"}`}
            >
                <i className={`pi ${password === "password" ? "pi-eye" : "pi-eye-slash"}`}></i>
            </div>
            <ErrorMessage name={name} component="p" className="text-red-500 text-sm mt-1 text-center w-full font-bold" />
        </div>
    )
}


export default CustomInputComponent;