import * as Yup from 'yup';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import { generateReport } from '../api/generateReport';
import { useState } from 'react';
import { Toast } from '../components/UI/toast';

export default function Report() {
    const [isLoading, setIsLoading] = useState(false);
    const reportSchema = Yup.object({
        month: Yup.string().required("Mes es obligatorio"),
        year: Yup.string().required("Año es obligatorio")
    })

    const months = Array.from({ length: 12 }, (_, i) => String(i + 1));
    const years = Array.from({ length: 2050 - 2026 + 1 }, (_, i) => String(2026 + i));

    const handleGenerateReport = async (values) => {
        try {
            setIsLoading(true);
            const response = await generateReport(values.month, values.year);

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
            Toast.fire({
                icon: "success",
                title: "Reporte generado exitosamente"
            })
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: "No se pudo generar el reporte"
            })
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-[calc(100vh-80px)] px-4 py-10">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-[#3041A0] to-[#25348a] p-6 text-white">
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight italic">Reportes</h1>
                        <p className="text-white/90 mt-1 text-sm md:text-base">
                            Selecciona un mes y un año para generar el reporte
                        </p>
                    </div>

                    <div className="p-6 md:p-8">
                        <Formik
                            initialValues={{ month: "", year: "" }}
                            validationSchema={reportSchema}
                            onSubmit={handleGenerateReport}
                        >
                            <Form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                                            Mes
                                        </label>
                                        <div className="relative">
                                            <Field
                                                as="select"
                                                name="month"
                                                className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-3 py-2.5 pr-10 outline-none focus:border-[#3041A0] focus:ring-2 focus:ring-[#3041A0]/30 transition"
                                            >
                                                <option value="" disabled>
                                                    Selecciona un mes
                                                </option>
                                                {months.map((m) => (
                                                    <option key={m} value={m}>
                                                        {m}
                                                    </option>
                                                ))}
                                            </Field>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                                                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                        <ErrorMessage
                                            name="month"
                                            component="div"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                                            Año
                                        </label>
                                        <div className="relative">
                                            <Field
                                                as="select"
                                                name="year"
                                                className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-3 py-2.5 pr-10 outline-none focus:border-[#3041A0] focus:ring-2 focus:ring-[#3041A0]/30 transition"
                                            >
                                                <option value="" disabled>
                                                    Selecciona un año
                                                </option>
                                                {years.map((y) => (
                                                    <option key={y} value={y}>
                                                        {y}
                                                    </option>
                                                ))}
                                            </Field>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                                                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                        <ErrorMessage
                                            name="year"
                                            component="div"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-end gap-3">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full md:w-auto bg-[#3041A0] hover:bg-[#25348a] disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl cursor-pointer font-semibold transition active:scale-[.98] shadow-sm inline-flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <i className="pi pi-spin pi-spinner" style={{ fontSize: '1rem' }}></i>
                                        ) : (
                                            <i className='pi pi-download'></i>
                                        )}
                                        <span>{isLoading ? 'Generando...' : 'Generar'}</span>
                                    </button>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
}