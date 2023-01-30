import { ToastContainer } from 'react-toastify';

const Toastify = () => {
  return (
    <ToastContainer
      className='Toaster'
      position="bottom-right"
      autoClose={6000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};

export default Toastify;