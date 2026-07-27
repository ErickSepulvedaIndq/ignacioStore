import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useUpdateUser } from "../../api/hooks/usersHooks";
import { useAuth } from '../../context/AuthContext'
import toast from "react-hot-toast";

export default function ChangePasswordPage() {
    const { user } = useAuth();
    const { mutateAsync: updateUser } = useUpdateUser();

    const handleUpdatePassword = (values) => {
        toast.promise(
            updateUser({ userId: user.userId, userData: { password: values.password } }),
            {
                loading: "Actualizando datos...",
                success: "Datos actualizados correctamente!",
                error: (e) => {
                    console.error(e);
                    return "Error al actualizar los datos, intente más tarde."
                }
            }
        )
    };

    const schema = Yup.object({
        password: Yup.string().required("Obligatorio"),
        confirmPassword: Yup.string().required("Obligatorio").oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    });

    return (
        <div className="flex justify-center items-center">

            <div className="p-12 rounded-3xl w-full max-w-md">

                <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
                    Cambiar contraseña
                </h1>

                <Formik
                    initialValues={{ password: "", confirmPassword: "" }}
                    validationSchema={schema}
                    onSubmit={handleUpdatePassword}
                >
                    {() => (
                        <Form className="space-y-8">
                            <div className="relative">
                                <Field
                                    name="password"
                                    type="password"
                                    placeholder=" "
                                    className="peer w-full border border-gray-300 rounded-xl px-4 pt-6 pb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all 
                                    peer-placeholder-shown:top-4 
                                    peer-placeholder-shown:text-base 
                                    peer-placeholder-shown:text-gray-400
                                    peer-focus:top-2 
                                    peer-focus:text-sm 
                                    peer-focus:text-indigo-600">
                                    Nueva contraseña
                                </label>
                                <ErrorMessage name="password" component="p" className="text-red-500 text-sm mt-1" />
                            </div>
                            <div className="relative">
                                <Field
                                    name="confirmPassword"
                                    type="password"
                                    placeholder=" "
                                    className="peer w-full border border-gray-300 rounded-xl px-4 pt-6 pb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all 
                                    peer-placeholder-shown:top-4 
                                    peer-placeholder-shown:text-base 
                                    peer-placeholder-shown:text-gray-400
                                    peer-focus:top-2 
                                    peer-focus:text-sm 
                                    peer-focus:text-indigo-600">
                                    Confirmar contraseña
                                </label>
                                <ErrorMessage name="confirmPassword" component="p" className="text-red-500 text-sm mt-1" />
                            </div>

                            <button className="w-full bg-[#3041A0] hover:bg-[#25348a] text-white py-3 rounded-xl font-semibold transition cursor-pointer">
                                Actualizar contraseña
                            </button>

                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}