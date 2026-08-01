import { Form, Formik } from "formik";
import CustomButtonComponent from "../../components/UI/CustomButtonComponent";
import CustomInputComponent from "../../components/UI/CustomInputComponent";
import { useAuth } from "../../context/AuthContext";
import { useChangePassword, useChangeProfilePhoto, useUpdateUser, useUser } from "../../api/hooks/usersHooks";
import LoadingComponent from "../../components/UI/LoadingComponent"
import ErrorComponent from "../../components/UI/ErrorComponent";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRef } from "react";
import ProfilePhotoComponent from "../../components/UI/ProfilePhotoComponent";
import UpdateGeneralDataScheme from "../../components/forms/schemes/UpdateGeneralDataScheme";
import UpdatePasswordScheme from "../../components/forms/schemes/UpdatePasswordScheme";

const UserSettingsPage = () => {
    const { user } = useAuth()
    const { data: userData, isLoading, isError, refetch } = useUser(user.userId)
    const { mutateAsync: changePassword } = useChangePassword();
    const { mutateAsync: updateUser } = useUpdateUser();
    const { mutateAsync: changeProfilePhoto } = useChangeProfilePhoto();
    const [profilePhotoURl, setProfilePhotoUrl] = useState();
    const fileInputRef = useRef(null);

    const initialValues = {
        firstName: userData?.firstName || "",
        lastName: userData?.lastName || "",
        username: userData?.username || ""
    }

    const initialPasswordValues = {
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    }

    const onSubmitHandle = (values) => {
        toast.promise(
            updateUser({ userId: user.userId, userData: values }),
            {
                isLoading: "Guardando datos...",
                success: "Datos actualizados exitosamente!",
                error: (e) => {
                    console.error(e);
                    return "Error al actualizar los datos, intente más tarde."
                }
            }
        )
    }

    const changePasswordHandle = (values) => {
        toast.promise(
            changePassword({ userId: user.userId, data: values }),
            {
                loading: 'Actualizando contraseña...',
                success: () => {
                    return 'Contraseña actualizada correctamente!'
                },
                error: (error) => {
                    console.error(error);
                    if (error.response.data.message === "Credenciales Invalidas") return 'Error: La contraseña no es correcta.'
                    return 'Error al actualizar contraseña, intente más tarde.'
                }
            }
        )
    }

    const handleFileSelected = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        toast.promise(
            changeProfilePhoto({ userId: user.userId, userPhoto: file }),
            {
                loading: "Actualizando foto de perfil...",
                success: () => {
                    const url = URL.createObjectURL(file);
                    setProfilePhotoUrl(url);
                    return "Foto de perfil actualizada!"
                },
                error: (e) => {
                    console.error(e);
                    return "Error al actualizar la foto de perfil, intente más tarde."
                }
            }
        )
    };

    return (
        <div className="w-full h-full overflow-auto p-3 md:p-6 lg:p-15 xl:p-20 flex flex-col gap-6 md:gap-8">

            <div className="flex flex-col gap-2 shadow-custom p-4 rounded-lg">
                <h1 className="font-bold text-lg text-gray-800">Datos generales:</h1>

                {isLoading ? <LoadingComponent /> : isError ? <ErrorComponent refetch={refetch} /> : (
                    <div className="flex flex-col md:flex-row gap-2 md:gap-8 ">
                        <div className="w-full lg:max-w-100">
                            <h1 className="font-bold text-gray-500 pl-1">Foto de perfil:</h1>
                            <div className=" flex-col inset-shadow-custom p-6 rounded-lg flex justify-center items-center gap-3 md:gap-2">
                                <ProfilePhotoComponent image={profilePhotoURl} size={'h-30 w-30'} iconStyle={'text-7xl'} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleFileSelected}
                                    className="hidden"
                                />
                                <CustomButtonComponent onClick={() => fileInputRef.current.click()} type={"button"} >
                                    <i className="pi pi-image"></i>
                                    <p>Cambiar foto de perfil</p>
                                </CustomButtonComponent>
                            </div>
                        </div>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={UpdateGeneralDataScheme}
                            onSubmit={onSubmitHandle}
                        >
                            {({ values, isSubmitting, isValid }) => (
                                <Form className="w-full flex flex-col gap-4">
                                    <div className="flex flex-row md:flex-col gap-2 md:gap-4">
                                        <CustomInputComponent
                                            label={'Nombre'}
                                            name={'firstName'}
                                            type={"text"}
                                            value={values.firstName}
                                        />

                                        <CustomInputComponent
                                            label={'Apellido'}
                                            name={'lastName'}
                                            type={"text"}
                                            value={values.lastName}
                                        />
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 md:items-center ">
                                        <CustomInputComponent
                                            label={'Nombre de usuario'}
                                            name={'username'}
                                            type={"text"}
                                            value={values.username}
                                        />

                                        <CustomButtonComponent disabled={isSubmitting || !isValid} type={"submit"} buttonStyles={"md:mt-6"}>
                                            <i className="pi pi-save"></i>
                                            <p>Guardar</p>
                                        </CustomButtonComponent>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                )}
            </div>

            <Formik
                validationSchema={UpdatePasswordScheme}
                initialValues={initialPasswordValues}
                onSubmit={changePasswordHandle}
            >
                {({ values, isSubmitting, isValid }) => (
                    <Form className="flex flex-col gap-2 shadow-custom p-4 rounded-lg">
                        <h1 className="font-bold text-lg text-gray-800">Cambiar contraseña:</h1>
                        <div className="flex flex-col gap-3 md:gap-4">

                            <CustomInputComponent
                                label={'Contraseña actual'}
                                name={'currentPassword'}
                                type={"password"}
                                placeholder={"********"}
                                value={values.currentPassword}
                            />

                            <CustomInputComponent
                                label={'Nueva contraseña'}
                                name={'newPassword'}
                                type={"password"}
                                placeholder={"********"}
                                value={values.newPassword}
                            />

                            <CustomInputComponent
                                label={'Confirmar nueva contraseña'}
                                name={'confirmNewPassword'}
                                type={"password"}
                                placeholder={"********"}
                                value={values.confirmNewPassword}
                            />

                            <CustomButtonComponent disabled={isSubmitting || !isValid} type={"submit"} buttonStyles={"md:mt-6"}>
                                <i className="pi pi-save"></i>
                                <p>Cambiar contraseña</p>
                            </CustomButtonComponent>
                        </div>

                    </Form>
                )}
            </Formik>
        </div >
    )
}

export default UserSettingsPage;