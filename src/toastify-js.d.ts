declare module 'toastify-js' {
    interface ToastifyOptions {
      text: string;
      duration?: number;
      close?: boolean;
      gravity?: 'top' | 'bottom';
      position?: 'left' | 'center' | 'right';
      backgroundColor?: string;
      avatar?: string;
      className?: string;
      stopOnFocus?: boolean;
      onClick?: () => void;
      style?: Record<string, string>;
    }
  
    interface Toastify {
      showToast: () => void;
    }
  
    function Toastify(options: ToastifyOptions): Toastify;
  
    export default Toastify;
  }