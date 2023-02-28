import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import NavBar from "./components/navBar";
import PersonForm from "./components/personForm";
import { Routes, Route } from "react-router-dom";
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
            <Route path="/habitantes/:id" component={PersonForm} />
          </Routes>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
