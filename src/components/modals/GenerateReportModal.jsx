import { ErrorMessage, Form, Formik } from "formik";
import ModalComponent from "./ModalComponent";
import { useGenerateReport } from "../../api/hooks/buyLogsHooks";
import toast from "react-hot-toast";
import CustomButtonComponent from "../UI/CustomButtonComponent";
import InputMonthPicker from "../UI/inputs/InputMonthPicker.jsx";
import ReportScheme from "../forms/schemes/ReportScheme.js";

const GenerateReportModal = ({ isOpen, onClose }) => {
    const { mutateAsync: generateReport, isLoading } = useGenerateReport();

    const handleGenerateReport = async (values) => {
        console.log(values.date.getMonth())
        try {
            const response = await generateReport({ month: values.date.getMonth() + 1, year: values.date.getFullYear() });

            const contentType = response.headers?.["content-type"] || "";
            if (contentType.includes("application/json")) {
                const text = await response.data.text();
                const data = JSON.parse(text);
                throw new Error(data?.message || "No se pudo generar el reporte");
            }

            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `reporte-${values.month}-${values.year}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Reporte generado exitosamente!")
        } catch (error) {
            console.error(error);
            toast.error("Error al generar reporte, inténtelo más tarde.");
        }
    }


    return (
        <ModalComponent
            isOpen={isOpen}
            onClose={onClose}
            title={"Generar reporte"}
            iconStyles={'pi pi-file-export'}
        >
            <Formik
                initialValues={{ month: "", year: "", date: "" }}
                validationSchema={ReportScheme}
                onSubmit={handleGenerateReport}
            >
                {({ values, setFieldValue, isValid, setFieldTouched }) => (
                    <Form className="flex flex-col gap-5">
                        <div>
                            <InputMonthPicker
                                label={"Seleccione mes y año."}
                                value={values.date}
                                onChange={(date) => {
                                    setFieldTouched("date", true, false);
                                    setFieldValue("date", date);
                                }}
                            />
                            <ErrorMessage
                                name="date"
                                component="p"
                                className="text-red-500 text-sm mt-1 text-center w-full font-bold"
                            />
                        </div>

                        <CustomButtonComponent
                            type="submit"
                            disabled={isLoading || !isValid}
                        >
                            {isLoading ? (
                                <i className="pi pi-spin pi-spinner" style={{ fontSize: '1rem' }}></i>
                            ) : (
                                <i className='pi pi-download'></i>
                            )}
                            <span>{isLoading ? 'Descargando...' : 'Descargar'}</span>
                        </CustomButtonComponent>
                        {/* {JSON.stringify(errors)} */}
                    </Form>
                )}
            </Formik>

        </ModalComponent>
    )
}

export default GenerateReportModal;
