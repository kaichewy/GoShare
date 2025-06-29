import HomeView from "./views/HomeView";
import ProductView from "./views/ProductView";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "@/components/NavBar/NavBar";
import ShopFooter from "@/components/Footer/ShopFooter";
import ErrorView from "./views/ErrorView";
import CartView from "./views/CartView";
import DeliveryView from "./views/DeliveryView";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect } from "react";
import { useGlobalContext } from "@/components/GlobalContext/GlobalContext";
import { ToastContainer, toast } from "react-toastify";
import Modal from "./components/Modals/Modal";
import CancelOrder from "./components/Modals/CancelOrder";
import "react-toastify/dist/ReactToastify.css";
import RequestCookie from "./components/CookieBanner/CookieBanner";
import Sidebar from "./components/Sidebar/Sidebar";
import ProfileView  from "./views/ProfileView";

function App() {
  let { store } = useGlobalContext();
  let { modal } = useGlobalContext();
  
  useEffect(() => {
    if (store.state.products.length > 0) return;
    store.getProducts();
  }, []);
  
  return (
    <div>
      
      <BrowserRouter>
        <Sidebar></Sidebar>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/cart" element={<CartView />} />
          <Route path="/delivery" element={<DeliveryView />} />
          <Route path="/product/:productID" element={<ProductView />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="*" element={<ErrorView />} />
        </Routes>
      </BrowserRouter>
      {modal.opened && (
        <Modal
          header={modal.isRegister ? "Create Account" : "Login"}
          submitAction="/"
          buttonText={modal.isRegister ? "Create Account" : "Login"}
          isRegister={modal.isRegister}
        />
      )}
      {modal.isCancelModal && <CancelOrder></CancelOrder>}
      <ToastContainer />
      {/* <RequestCookie /> */}
    </div>
  );
}

export default App;