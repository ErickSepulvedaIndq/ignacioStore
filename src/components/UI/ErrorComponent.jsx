const ErrorComponent = ({ text = "Error al cargar recurso.", icon = "pi-info-circle", refetch }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-3">
            <div className="bg-red-500 border border-red-500 rounded-lg p-4 max-w-50 flex flex-col justify-center items-center gap-2">
                <i className={`pi ${icon} text-white text-2xl`}></i>
                <p className="text-white text-sm font-bold text-center">{text}</p>
            </div>
            <button onClick={() => refetch()} className="flex items-center justify-center gap-2 rounded-lg bg-blue-800 text-white p-2 font-bold text-xs hover:scale-105 cursor-pointer transition ease-in-out">
                <i className="pi pi-refresh"></i>
                <span>Reintentar</span>
            </button>
        </div>
    );
}

export default ErrorComponent;