import * as Yup from 'yup';

const CreateProductScheme = Yup.object({
    name: Yup.string().required("El nombre es requerido."),
    description: Yup.string().required("La descripción es requerida."),
    price: Yup.string().required("El precio es requerido."),
    stock: Yup.string().required("El stock es requerido."),
    status: Yup.string().required("El estado es requerido."),
    image: Yup.string().required("La imagen es requerida.")
})



// const formData = {
//     name: product?.name || "",
//     description: product?.description || "",
//     price: product?.price || "",
//     stock: product?.stock || "",
//     status: product?.status || "active",
//     image: product?.image?.url || null,
// }

export default CreateProductScheme;