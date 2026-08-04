import { Form, Formik } from "formik";
import { useChangeProfilePhoto, useCreateUser, useUpdateUser } from "../../api/hooks/usersHooks";
import toast from "react-hot-toast";
import CustomInputComponent from "../UI/inputs/CustomInputComponent";
import ModalComponent from "../modals/ModalComponent";
import CustomButtonComponent from "../UI/CustomButtonComponent";
import ProfilePhotoComponent from "../UI/ProfilePhotoComponent";
import { useRef } from "react";
import { useState } from "react";

export default function UserFormModal({ isOpen, onClose, user, mode = "create" }) {
  const { mutateAsync: createUser } = useCreateUser();
  const { mutateAsync: editUser } = useUpdateUser();
  const { mutateAsync: changeProfilePhoto } = useChangeProfilePhoto();
  const fileInputRef = useRef(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(user?.profilePhoto?.url);
  const [prevUserId, setPrevUserId] = useState(user?._id);

  if (user?._id !== prevUserId) {
    setPrevUserId(user?._id);
    setProfilePhotoUrl(user?.profilePhoto?.url);
  }

  const formData = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    password: user?.password || "",
    role: user?.role || "user",
    debt: user?.debt || 0,
    status: user?.status || "active",
  }

  const handleSubmit = async (values) => {
    if (mode === "create") {
      toast.promise(
        createUser({ userData: values }),
        {
          loading: 'Creando usuario..',
          success: 'Usuario creado exitosamente!',
          error: (err) => {
            console.error(err);
            return 'Error al crear usuario, intente más tarde.'
          }
        }
      )
    } else {
      toast.promise(
        editUser({ userId: user?._id, userData: values }),
        {
          loading: 'Editando usuario...',
          success: 'Usuario editado correctamente!',
          error: (err) => {
            console.error(err);
            return 'Error al editar usuario, intente más tarde.'
          }
        }
      )
    }
    onClose()
  };

  const handleFileSelected = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    toast.promise(
      changeProfilePhoto({ userId: user._id, userPhoto: file }),
      {
        loading: "Actualizando foto de perfil...",
        success: () => {
          const url = URL.createObjectURL(file);
          setProfilePhotoUrl(url);
          return "Foto de perfil actualizada!"
        },
        error: (e) => {
          console.error(e);
          return "Error al actualizar la foto de perfil, intente más tarde."
        }
      }
    )
  };

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "edit" ? "Editar usuario" : mode === "view" ? "Ver usuario" : "Crear usuario"}
      iconStyles={mode === "edit" ? "pi-pencil" : mode === "view" ? "pi-eye" : "pi-user-plus"}
    >
      <Formik
        initialValues={formData}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <div className="w-full max-w-lg">
            <Form className="space-y-6">
              <div className='flex flex-col gap-3'>

                <div className="w-full h-full">
                  <h1 className="font-bold text-gray-500 pl-1">Foto de perfil:</h1>
                  <div className="flex-col inset-shadow-custom p-6 rounded-lg flex justify-center items-center gap-3 md:gap-2">
                    <ProfilePhotoComponent image={profilePhotoUrl} size={'h-30 w-30'} iconStyle={'text-7xl'} />
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileSelected}
                      className="hidden"
                    />
                    <CustomButtonComponent onClick={() => fileInputRef.current.click()} buttonStyles={mode === 'view' ? "hidden!" : ''} type={"button"} >
                      <i className="pi pi-image"></i>
                      <p>{mode === 'edit' ? 'Cambiar foto de perfil' : 'Agregar foto de perfil'}</p>
                    </CustomButtonComponent>
                  </div>
                </div>

                <div className="flex flex-row gap-6">
                  <CustomInputComponent name={"firstName"} type={"text"} label={"Nombre"} value={values.firstName} disabled={mode === "view"} />
                  <CustomInputComponent name={"lastName"} type={"text"} label={"Apellido"} value={values.lastName} disabled={mode === "view"} />
                </div>

              </div>
              <CustomInputComponent name={"username"} type={"text"} label={"Nombre de usuario"} value={values.username} disabled={mode === "view"} />

              {mode !== "view" && (
                <CustomInputComponent name={"password"} type={"passwo ) : <LoadingComponent />}rd"} placeholder={'********'} label={mode === "edit" ? "Nueva contraseña (opcional)" : "Contraseña"} value={values.password} />
              )}

              <div className="grid grid-cols-3 gap-6">
                <CustomInputComponent
                  name={"status"}
                  type={"select"}
                  label={"Estado"}
                  value={values.status}
                  disabled={mode === "view"}
                  options={[
                    { value: "active", label: "Activo" },
                    { value: "inactive", label: "Inactivo" },
                  ]}
                />
                <CustomInputComponent
                  name={"role"}
                  type={"select"}
                  label={"Rol"}
                  value={values.role}
                  disabled={mode === "view"}
                  options={[
                    { value: "admin", label: "Admin" },
                    { value: "user", label: "Usuario" },
                  ]}
                />
                <CustomInputComponent
                  name={"debt"}
                  type={"number"}
                  label={"Deuda"}
                  value={values.debt}
                  disabled={mode === "view"}
                />
              </div>

              {mode !== "view" && (
                <div className="flex justify-end space-x-4 pt-4">
                  <CustomButtonComponent
                    type="button"
                    onClick={onClose}
                    buttonStyles={'bg-red-500'}
                  >
                    Cancelar
                  </CustomButtonComponent>

                  <CustomButtonComponent
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <i className="pi pi-save"></i>
                    {isSubmitting ? "Guardando..." : "Guardar"}
                  </CustomButtonComponent>
                </div>
              )}
            </Form>
          </div>
        )}
      </Formik>
    </ModalComponent>
  );
}