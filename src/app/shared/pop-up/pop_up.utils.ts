import Swal from 'sweetalert2'

async function showSuccessPopup(success_message: string) {
  Swal.fire({
    customClass: {
      container: 'my-swal'
    },
    title: 'Éxito',
    text: success_message,
    icon: 'success'
  });
}

async function showErrorPopup(error_message: string) {
  Swal.fire({
    customClass: {
      container: 'my-swal'
    },
    title: 'Error',
    text: error_message,
    icon: 'error'
  });
}

export {
  showSuccessPopup,
  showErrorPopup
};
