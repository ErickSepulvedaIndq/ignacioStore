const InputSearchBarComponent = ({ placeholder = 'Buscar...', onChange }) => {

    return (
        <div className='w-full relative'>
            <input onChange={(v) => onChange(v.target.value)} type="text" placeholder={placeholder} className='inset-shadow-custom bg-gray-100 w-full rounded-lg pl-8 pr-2 py-2' />
            <i className='absolute text-gray-500 pi pi-search left-2 top-3'></i>
        </div>
    )
}

export default InputSearchBarComponent;