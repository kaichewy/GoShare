// Sidebar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaBars } from "react-icons/fa";
import { useGlobalContext } from "@/components/GlobalContext/GlobalContext";
import Modal from "@/components/Modals/Modal";
import "./Sidebar.css";


const Sidebar = () => {
  const { auth, store, modal } = useGlobalContext();
  const cartTotal = store.state.cartQuantity;
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);
  const handleShowModal = () => {
    modal.openModal(false);
    handleClose();
  };
  const handleLogout = () => {
    auth.logout();
    handleClose();
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={handleToggle}>
        <FaBars size={24} />
      </button>

      {isOpen && <div className="sidebar-overlay" onClick={handleClose} />}

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-links">
          <button className="sidebar-close" onClick={handleClose}>×</button>
          <Link to="/" className="sidebar-link" onClick={handleClose}>
            Home
          </Link>
          <Link to="/dashboard" className="sidebar-link" onClick={handleClose}>
            Dashboard
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

        {modal.opened && (
          <Modal
            header={modal.isRegister ? "Create Account" : "Login"}
            submitAction="/"
            buttonText={modal.isRegister ? "Create Account" : "Login"}
            isRegister={modal.isRegister}
          />
        )}
      </div>
    </>
  );
};

export default Sidebar;
