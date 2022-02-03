import Swal from "sweetalert2";

export function fireAlert(title:any, text:any, icon:any){
  Swal.fire({
    customClass: {
      container: 'my-swal',
    },
    title: title,
    text: text,
    icon: icon,
  });
}