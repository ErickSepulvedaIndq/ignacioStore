import Swal from "sweetalert2";

export const ConfirmAction = async ({
    title,
    text,
    onConfirm,
    confirmButtonText = "Confirmar",
    cancelButtonText = "Cancelar",
    icon = "question",
}) => {
    const result = await Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        reverseButtons: true,
    });

    if (result.isConfirmed && onConfirm) {
        try {
            Swal.showLoading();
            await onConfirm();
            Swal.close();
        } catch (err) {
            Swal.close();
            Swal.fire({
                icon: "error",
                title: "Ocurrió un error",
                text: err.message || "Intenta nuevamente",
            });
        }
    }
};
