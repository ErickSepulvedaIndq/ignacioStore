import { Form, Formik } from "formik";
import CustomButtonComponent from "../../components/UI/CustomButtonComponent";
import CustomInputComponent from "../../components/UI/CustomInputComponent";
import { useAuth } from "../../context/AuthContext";
import { useUpdateUser, useUser } from "../../api/hooks/usersHooks";
import LoadingComponent from "../../components/UI/LoadingComponent"
import ErrorComponent from "../../components/UI/ErrorComponent";
import toast from "react-hot-toast";
import * as Yup from 'yup';
import { useState } from "react";
import { useRef } from "react";

const UserSettingsPage = () => {
    const { user } = useAuth()
    const { data: userData, isLoading, isError, refetch } = useUser(user.userId)
    const { mutateAsync: updateUser } = useUpdateUser();
    const [profilePhoto, setProfilePhoto] = useState();
    const fileInputRef = useRef(null);

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

    const changePasswordHandle = (values) => { console.log(values) }

    const handleFileSelected = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setProfilePhoto(file);
        console.log(profilePhoto)
    };

    const UpdateGeneralDataScheme = Yup.object({
        firstName: Yup.string()
            .min(2, "El nombre debe tener un mínimo de 2 caracteres.")
            .required("El nombre es requerido."),
        lastName: Yup.string()
            .min(2, "El apellido debe tener un mínimo de 2 caracteres.")
            .required("El apellido es requerido."),
        username: Yup.string()
            .min(2, "El apellido debe tener un mínimo de 2 caracteres.")
            .required("El nombre de usuario es requerido."),
    });

    const initialValues = {
        firstName: userData?.firstName || "",
        lastName: userData?.lastName || "",
        username: userData?.username || ""
    }


    const passwordRules = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

    const UpdatePasswordScheme = Yup.object({
        currentPassword: Yup.string()
            .required("La contraseña actual es requerida."),
        newPassword: Yup.string()
            .matches(
                passwordRules,
                'Debe contener al menos una letra, un número y tener 6 caracteres o más'
            )
            .required("La nueva contraseña es requerida."),
        confirmNewPassword: Yup.string()
            .oneOf([Yup.ref('newPassword')], 'Las contraseñas no coinciden')
            .required("Es necesario confirmar la nueva contraseña."),
    })

    const initialPasswordValues = {
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    }

    return (
        <div className="w-full h-full overflow-auto p-3 md:p-6 lg:p-15 xl:p-20 flex flex-col gap-6 md:gap-8">

            <div className="flex flex-col gap-2 shadow-custom p-4 rounded-lg">
                <h1 className="font-bold text-lg text-gray-800">Datos generales:</h1>

                {isLoading ? <LoadingComponent /> : isError ? <ErrorComponent refetch={refetch} /> : (
                    <div className="flex flex-col md:flex-row gap-2 md:gap-8 ">
                        <div className="w-full lg:max-w-100">
                            <h1 className="font-bold text-gray-500 pl-1">Foto de perfil:</h1>
                            <div className=" flex-col inset-shadow-custom p-6 rounded-lg flex justify-center items-center gap-3">
                                <div className="rounded-full flex justify-center items-center border-5 border-blue-900 bg-gray-300 h-20 w-20">
                                    <i className="pi pi-user text-blue-900 text-5xl"></i>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleFileSelected}
                                    className="hidden"
                                />
                                <CustomButtonComponent onClick={() => fileInputRef.current.click()} type={"button"} buttonStyles={"md:mt-6"}>
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