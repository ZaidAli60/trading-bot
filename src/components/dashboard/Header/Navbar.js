import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";

export default function Navbar() {


  return (
    <>
      <header className="position-sticky top-0" style={{ zIndex: 100,backgroundColor:"#0f172a" }}>
        <nav className="navbar navbar-expand-lg  navbar-dark shadow-lg">
          <div className="container-fluid">
            <div className='logo'>
              <Link className='main-link text-decoration-none fs-5 text-white' to='/'>
                <i className="fa-solid fa-arrow-trend-up"></i> Crypto-Trading-Bot
              </Link>
            </div>
            <div className="d-flex">
              <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto">
          
                     <Button  type='primary' >Connect Wallet</Button>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
