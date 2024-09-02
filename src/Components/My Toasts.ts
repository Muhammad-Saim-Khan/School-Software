import "toastify-js/src/toastify.css";
import Toastify from "toastify-js";

function toastGreen(message: any) {
  return Toastify({
    text: message,
    duration: 2500,
    close: true,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: { background: "rgb(25, 135, 84)" },
    onClick: function () {},
  }).showToast();
}

function toastRed(message: any) {
  return Toastify({
    text: message,
    duration: 2500,
    close: true,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: { background: "rgb(220, 53, 69)" },
    onClick: function () {},
  }).showToast();
}

export { toastGreen, toastRed };
