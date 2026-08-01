const CustomButtonComponent = ({ children, onClick, buttonStyles, type, disabled }) => {
    return (
        <button
            type={type}
            className={`bg-blue-900 text-white font-bold text-sm rounded-lg p-2 
                transition hover:scale-105 active:scale-97 cursor-pointer flex flex-row
                gap-2 justify-center items-center h-fit disabled:bg-gray-500 disabled:cursor-not-allowed
                disabled:active:scale-100 disabled:hover:scale-100 ${buttonStyles}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}

export default CustomButtonComponent;