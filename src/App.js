import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/navBar";
import People from "./components/People/people";
import PersonForm from "./components/People/personForm";
import Towns from "./components/Towns/towns";
import TownForm from "./components/Towns/townForm";
import Houses from "./components/Houses/houses";
import HouseForm from "./components/Houses/houseForm";
import NotFound from "./components/common/notFound";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

class App extends Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <NavBar user={this.state.user} />
        <main className="container" style = {{ backgroundImage: `url(/Background.jpg)`}}>
          <Routes>
            <Route path="/habitantes/:id" element={<PersonForm />} />
            <Route path="/municipios/:id" element={<TownForm />} />
            <Route path="/viviendas/:id" element={<HouseForm />} />
            <Route path="/habitantes" element={<People />} />
            <Route path="/municipios" element={<Towns />} />
            <Route path="/viviendas" element={<Houses />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="/" element={<Navigate to="/habitantes" replace />} />
          </Routes>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
