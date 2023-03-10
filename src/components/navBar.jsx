import React from "react";
import { Link, NavLink } from "react-router-dom";

const NavBar = ({ user }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">
        Laboratorio 0
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <NavLink className="nav-item nav-link" to="/habitantes">
            Habitantes
          </NavLink>
          <NavLink className="nav-item nav-link" to="/municipios">
            Municipios
          </NavLink>
          <NavLink className="nav-item nav-link" to="/viviendas">
            Viviendas
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
