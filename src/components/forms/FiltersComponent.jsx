import { useEffect, useRef } from "react";
import { useUsersNames } from "../../api/hooks/usersHooks";
import { Form, Formik, useFormikContext } from "formik";
import CustomInputComponent from "../UI/inputs/CustomInputComponent";
import InputDateRangePicker from "../UI/inputs/InputDateRangePicker";
import InputSearchBarComponent from "../UI/inputs/InputSearchBarComponent"
import { format } from "date-fns";
import { useState } from "react";
import CustomButtonComponent from "../UI/CustomButtonComponent";


const toApiDate = (date) => (date ? format(date, "yyyy-MM-dd") : "");

const AutoApply = ({ onApply }) => {
  const { values } = useFormikContext();
  const isFirstRender = useRef(true);
  const onApplyRef = useRef(onApply);

  useEffect(() => {
    onApplyRef.current = onApply;
  });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onApplyRef.current(
      toApiDate(values.fromDate),
      toApiDate(values.toDate),
      values.userId,
      values.state,
      values.search,
      values.rol,
      values.stock,
      values.debt
    );
  }, [values.fromDate, values.toDate, values.userId, values.search, values.state, values.rol, values.stock, values.debt]);

  return null;
}

export default function FiltersComponent({ onApply, searchFilter = true, userFilter = false, dateRangeFilter = false, stateFilter = false, button = false, buttonContent = "botón", buttonOnClick, stateOptions, rolFilter = false, stockFilter = false, stockOptions, debtFilter = false }) {
  const { data: userNames } = useUsersNames();
  const [isOpen, setIsOpen] = useState(false);

  const initialValues = {
    userId: "",
    fromDate: "",
    toDate: "",
    state: "",
    search: "",
    rol: "",
    stock: "",
    debt: ""
  }

  return (
    <div className={`rounded-lg transition-all ${isOpen ? button ? "shadow-[-10px_0px_10px_-10px_rgba(0,0,0,0.4),0px_10px_10px_-10px_rgba(0,0,0,0.4)]" : "shadow-custom-xs" : ''} `}>
      <Formik initialValues={initialValues} onSubmit={() => { }}>
        {({ values, setFieldValue }) => (
          <Form>
            {/* header */}
            <div className="flex flex-row w-full ">
              <div onClick={() => setIsOpen(!isOpen)} className={`flex flex-row justify-between 
                 items-center py-2 px-4 w-full bg-white  ${isOpen ? button ? "rounded-t-xl shadow-[5px_-10px_10px_-10px_rgba(0,0,0,0.4)]" : "rounded-t-xl" : "rounded-xl duration-800 shadow-custom-xs"} 
                 transition-all cursor-pointer`}>
                <div className="flex flex-row items-center justify-center gap-2">
                  <i className="pi pi-filter text-sm"></i>
                  <h1 className="font-bold text-gray-700 text-base md:text-lg">Filtros</h1>
                </div>

                <i
                  className={`pi pi-angle-down transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                    }`}
                ></i>
              </div>

              <div className={`${button ? "" : "hidden!"} flex justify-center pl-1 pb-1 self-stretch mr-2 rounded-bl ${isOpen ? "inset-shadow-[11px_-10px_10px_-19px_rgba(0,0,0,0.4)] bg-gray-100" : ""} z-10`}>
                <CustomButtonComponent onClick={buttonOnClick} buttonStyles={'h-full! rounded! rounded-tr-lg! shadow-custom!'}> {buttonContent} </CustomButtonComponent>
              </div>

            </div>

            <div
              className={`grid bg-white ${button ? "rounded-tr-xl shadow-[10px_0px_10px_-10px_rgba(0,0,0,0.4)]" : ""} transition-all rounded-b-xl ease-in-out duration-300 ${isOpen ? "grid-rows-[1fr] pt-2" : "grid-rows-[0fr] pt-0"
                }`}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col md:flex-row gap-4 px-4 pb-3 pt-2 md:pt-0">
                  <div className={searchFilter ? "flex w-full md:mt-5" : "hidden"}>
                    <InputSearchBarComponent name={"search"} value={values.search} />
                  </div>

                  <div className={userFilter ? "flex w-full" : "hidden"}>
                    <CustomInputComponent
                      name={'userId'}
                      label={'Buscar por usuario'}
                      type={'select'}
                      value={values.userId}
                      options={[
                        { value: "", label: "Todos los usuarios" },
                        ...(userNames?.map((user) => ({
                          value: user.id,
                          label: user.fullName || user.username || "Usuario",
                        })) ?? []),
                      ]}
                    />
                  </div>

                  <div className={dateRangeFilter ? "flex w-full" : "hidden"}>
                    <InputDateRangePicker
                      label={'Rango de fechas'}
                      from={values.fromDate}
                      to={values.toDate}
                      onChange={([start, end]) => {
                        setFieldValue('fromDate', start);
                        setFieldValue('toDate', end);
                      }}
                      portalId="calendar-portal"
                    />
                  </div>

                  <div className={stateFilter ? "flex w-full" : "hidden"}>
                    <CustomInputComponent
                      name={'state'}
                      label={'Buscar por estado'}
                      type={'select'}
                      value={values.state}
                      options={stateOptions}
                    />
                  </div>

                  <div className={rolFilter ? "flex w-full" : "hidden"}>
                    <CustomInputComponent
                      name={'rol'}
                      label={'Buscar por rol'}
                      type={'select'}
                      value={values.rol}
                      options={[
                        { value: "all", label: "Todos los roles" },
                        { value: "admin", label: "Administrador" },
                        { value: "user", label: "Usuario" }
                      ]}
                    />
                  </div>

                  <div className={stockFilter ? "flex w-full" : "hidden"}>
                    <CustomInputComponent
                      name={'stock'}
                      label={'Buscar por stock'}
                      type={'select'}
                      value={values.stock}
                      options={stockOptions}
                    />
                  </div>

                  <div className={debtFilter ? "flex w-full" : "hidden"}>
                    <CustomInputComponent
                      name={'debt'}
                      label={'Filtrar por deuda'}
                      type={'select'}
                      value={values.debt}
                      options={[
                        { value: "all", label: "Todos" },
                        { value: "debtDesc", label: "Mayor deuda" },
                        { value: "debtAsc", label: "Menor deuda" }
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
            <AutoApply onApply={onApply} />
          </Form>
        )}
      </Formik>
    </div>
  );
}