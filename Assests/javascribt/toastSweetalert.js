const Toast = Swal.mixin({
  toast: true,
  position: "top",
  iconColor: "white",
  customClass: {
    popup: "colored-toast",
  },
  showConfirmButton: false,
  timer: 10000,
  timerProgressBar: true,
});
