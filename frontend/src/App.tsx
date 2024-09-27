
import { ToastContainer } from "react-toastify";
import { Todo } from "./components/Todo";
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <>
      <div className="w-full h-screen flex justify-center items-center">
        <Todo />
        <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"/>
      </div>
    </>
  );
}

export default App;
