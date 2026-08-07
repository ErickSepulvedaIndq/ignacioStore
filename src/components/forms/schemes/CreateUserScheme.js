import * as Yup from 'yup';

const CreateUserScheme = Yup.object({
    firstName: Yup.string().required("El nombre es requerido."),
    lastName: Yup.string().required("El apellido es requerido."),
    username: Yup.string().required("El nombre de usuario es requerido."),
    password: Yup.string().required("La contraseña es requerida."),
    role: Yup.string().required("El rol es requerido."),
    status: Yup.string().required("El estado es requerido."),
})

export default CreateUserScheme;