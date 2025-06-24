import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useGlobalContext } from "@/components/GlobalContext/GlobalContext";
import { useState } from "react";
import Modal from "@/components/Modals/Modal";
import "./Sidebar.css";

const Sidebar = () => {
  let { auth, store, modal } = useGlobalContext();
  const cartTotal = store.state.cartQuantity;
  const [isRegister, setIsRegister] = useState(false); // Track if it's register or login mode
  const [loading, setLoading] = useState(false);

  const handleShowModal = () => {
    modal.openModal(false);
  };

  const handleLogout = () => {
    auth.logout();
  };

  const handleModalSwitch = () => {
    setIsRegister(!isRegister); // Toggle between login and register
  };

  return (
    <div className="sidebar">
      <div className="sidebar-links">
        <Link to="/login" className="sidebar-link" onClick={handleShowModal}>
          Login
        </Link>
        <Link to="/dashboard" className="sidebar-link">
          Dashboard
        </Link>
      </div>

      <div className="cart">
        <Link to="/cart" className="contains-link-to-accounts">
          {auth.state.user == null ? (
            <span className="account-user">Guest</span>
          ) : (
            <span className="account-user">
              {auth.state.user.username}
            </span>
          )}
          <span className="account-details">
            <FaShoppingCart />
            <span className="items-in-cart">{cartTotal}</span>
          </span>
        </Link>
      </div>

      <div className="login">
        {auth.state.user == null ? (
          <button className="btn-rounded small-rounded" onClick={handleShowModal}>
            Login
          </button>
        ) : (
          <button className="btn-rounded small-rounded" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

      {/* Modal for Login/Registration */}
      {modal.opened && (
        <Modal
          header={isRegister ? "Create Account" : "Login"}
          submitAction="/"
          buttonText={isRegister ? "Create Account" : "Login"}
          isRegister={isRegister}
        />
      )}
    </div>
  );
};

export default Sidebar;
