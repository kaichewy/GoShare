import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "@/components/Sidebar/Sidebar";  // Use Sidebar
import HomeView from "./views/HomeView";
import ShopFooter from "@/components/Footer/ShopFooter";
import ErrorView from "./views/ErrorView";
import CartView from "./views/CartView";
import DeliveryView from "./views/DeliveryView";
import DashboardView from "./views/DashboardView"; // Create a Dashboard view for the route
import "react-loading-skeleton/dist/skeleton.css";
import { useGlobalContext } from "@/components/GlobalContext/GlobalContext";
import { ToastContainer, toast } from "react-toastify";
import Modal from "./components/Modals/Modal";
import CancelOrder from "./components/Modals/CancelOrder";
import "react-toastify/dist/ReactToastify.css";
import RequestCookie from "./components/CookieBanner/CookieBanner";

function App() {
  let { store } = useGlobalContext();
  let { modal } = useGlobalContext();

  useEffect(() => {
    if (store.state.products.length > 0) return;
    store.getProducts();
  }, [store]);

  return (
    <div>
      <BrowserRouter>
        <header>
          <Sidebar /> {/* Sidebar instead of NavBar */}
        </header>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/cart" element={<CartView />} />
          <Route path="/delivery" element={<DeliveryView />} />
          <Route path="/dashboard" element={<DashboardView />} /> {/* New Dashboard route */}
          <Route path="*" element={<ErrorView />} />
        </Routes>
        <footer>
          <ShopFooter />
        </footer>
      </BrowserRouter>
      {modal.opened && (
        <Modal
          header={modal.isRegister ? "Create Account" : "Login"}
          submitAction="/"
          buttonText={modal.isRegister ? "Create Account" : "Login"}
          isRegister={modal.isRegister}
        />
      )}
      {modal.isCancelModal && <CancelOrder />}
      <ToastContainer />
    </div>
  );
}

export default App;
