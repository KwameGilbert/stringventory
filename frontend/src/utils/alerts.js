import Swal from 'sweetalert2';

// Custom styled alerts matching the app's design
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

// Success toast
export const showSuccess = (message, title = 'Success!') => {
  return Toast.fire({
    icon: 'success',
    title: title,
    text: message,
    iconColor: '#10B981',
  });
};

// Error toast
export const showError = (message, title = 'Error!') => {
  return Toast.fire({
    icon: 'error',
    title: title,
    text: message,
    iconColor: '#EF4444',
  });
};

// Warning toast
export const showWarning = (message, title = 'Warning!') => {
  return Toast.fire({
    icon: 'warning',
    title: title,
    text: message,
    iconColor: '#F59E0B',
  });
};

// Info toast
export const showInfo = (message, title = 'Info') => {
  return Toast.fire({
    icon: 'info',
    title: title,
    text: message,
    iconColor: '#3B82F6',
  });
};

// Confirm dialog (for delete operations)
export const confirmDelete = (itemName = 'this item') => {
  return Swal.fire({
    title: 'Are you sure?',
    text: `You are about to delete ${itemName}. This action cannot be undone.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#EF4444',
    cancelButtonColor: '#6B7280',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    customClass: {
      popup: 'rounded-2xl',
      confirmButton: 'rounded-lg px-6',
      cancelButton: 'rounded-lg px-6',
    }
  });
};

// General confirm dialog
export const confirmAction = (title, text, confirmText = 'Confirm') => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10B981',
    cancelButtonColor: '#6B7280',
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    customClass: {
      popup: 'rounded-2xl',
      confirmButton: 'rounded-lg px-6',
      cancelButton: 'rounded-lg px-6',
    }
  });
};

// Loading alert
export const showLoading = (message = 'Please wait...') => {
  return Swal.fire({
    title: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
    customClass: {
      popup: 'rounded-2xl',
    }
  });
};

// Close loading
export const closeLoading = () => {
  Swal.close();
};

// Success dialog (centered, not toast)
export const showSuccessDialog = (title, text) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'success',
    confirmButtonColor: '#10B981',
    confirmButtonText: 'OK',
    customClass: {
      popup: 'rounded-2xl',
      confirmButton: 'rounded-lg px-6',
    }
  });
};

// Error dialog (centered, not toast)
export const showErrorDialog = (title, text) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'error',
    confirmButtonColor: '#EF4444',
    confirmButtonText: 'OK',
    customClass: {
      popup: 'rounded-2xl',
      confirmButton: 'rounded-lg px-6',
    }
  });
};

export default {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  confirmDelete,
  confirmAction,
  showLoading,
  closeLoading,
  showSuccessDialog,
  showErrorDialog,
};
