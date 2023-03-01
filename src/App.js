import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/navBar";
import PersonForm from "./components/People/personForm";
import People from "./components/People/people";
import Towns from "./components/Towns/towns";
import NotFound from "./components/common/notFound";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import TownForm from "./components/Towns/townForm";

class App extends Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <NavBar user={this.state.user} />
        <main className="container">
          <Routes>
            <Route path="/habitantes/:id" element={<PersonForm />} />
            <Route path="/municipios/:id" element={<TownForm />} />
            <Route path="/habitantes" element={<People />} />
            <Route path="/municipios" element={<Towns />} />
            <Route path="/not-found" element={<NotFound />} />
          </Routes>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
