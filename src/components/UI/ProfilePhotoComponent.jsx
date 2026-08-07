

const ProfilePhotoComponent = ({ size, iconStyle, image }) => {
    return (
        <>
            <div className={`${image ? "hidden!" : "flex!"} rounded-full justify-center items-center border-5 border-blue-900 bg-gray-300 ${size}`}>
                <i className={`pi pi-user text-blue-900 text-5xl ${iconStyle}`}></i>
            </div>
            <img className={`${image ? "flex!" : "hidden!"} ${size} rounded-full object-cover bg-white border-white`} src={image} alt="" />
        </>
    )
}

export default ProfilePhotoComponent;