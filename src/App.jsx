import "./App.css";
import Main from "./components/Main";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Main />
      <ToastContainer /> {/* for notifications */}
    </>
  );
}

export default App;
