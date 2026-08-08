import * as Yup from 'yup';

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

export default UpdateGeneralDataScheme;