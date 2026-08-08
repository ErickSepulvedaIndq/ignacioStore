import * as Yup from 'yup';

const ReportScheme = Yup.object({
    date: Yup.date().required("La fecha es obligatoria")
        .max(new Date(), "No puede seleccionar fechas futuras"),
})

export default ReportScheme;