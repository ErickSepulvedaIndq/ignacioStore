import * as Yup from 'yup';

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

export default UpdatePasswordScheme;