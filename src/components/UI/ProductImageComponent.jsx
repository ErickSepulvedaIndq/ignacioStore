

const ProductImageComponent = ({ size, iconStyle, image }) => {
    return (
        <>
            <div className={`${image ? "hidden!" : "flex!"} rounded-lg justify-center items-center border-5 border-blue-900 bg-gray-300 ${size}`}>
                <i className={`pi pi-box text-blue-900 text-5xl ${iconStyle}`}></i>
            </div>
            <img className={`${image ? "flex!" : "hidden!"} ${size} rounded-lg object-cover border-3 border-blue-900 bg-white`} src={image} alt="" />
        </>
    )
}

export default ProductImageComponent;