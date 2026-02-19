import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import LoginHeader from "../components/UI/loginHeader";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginSchema = Yup.object({
    username: Yup.string().required("Username es obligatorio"),
    password: Yup.string().required("Password es obligatorio")
  });

  const handleSubmit = async (values) => {
    const success  = await login(values);
    if(success ) {
      navigate("/products");
    }
  };

  return (
    <>
      <LoginHeader />
      <div className="min-h-screen flex items-center justify-center">
      
      <div className="bg-white w-[380px] rounded-2xl shadow-xl p-10">

        <h1 className="text-3xl font-extrabold text-center text-[#3041A0]">
          INQNACIO STORE
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Inicia sesión para continuar
        </p>

        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">

              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Username
                </label>

                <Field
                  name="username"
                  type="text"
                  placeholder="Ingresa tu usuario"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#3041A0] focus:ring-2 focus:ring-[#3041A0]/30 transition"
                />

                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Password
                </label>

                <Field
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#3041A0] focus:ring-2 focus:ring-[#3041A0]/30 transition"
                />

                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#3041A0] text-white py-2.5 rounded-lg font-semibold tracking-wide hover:bg-[#25348a] transition active:scale-[.98]"
              >
                Iniciar Sesión
              </button>

            </Form>
          )}
        </Formik>

        <p className="text-center text-xs text-gray-400 mt-8">
          © {new Date().getFullYear()} Inqnacio Store
        </p>
      </div>
    </div>
    </>
  );
}
