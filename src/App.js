import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/navBar";
import PersonForm from "./components/personForm";
import People from "./components/people";
import Towns from "./components/towns";
import Rentals from "./components/rentals";
import NotFound from "./components/notFound";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

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
            <Route path="/habitantes" element={<People />} />
            <Route path="/municipios" element={<Towns />} />
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/not-found" element={<NotFound />} />
          </Routes>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
