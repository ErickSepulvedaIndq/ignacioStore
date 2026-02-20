import Swal from "sweetalert2";

export const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

export const showToast = ({
  icon,
  title,
  position = "top-end",
  timer = 3000,
}) => {
  return Toast.fire({
    icon,
    title,
    position,
    timer,
  });
};