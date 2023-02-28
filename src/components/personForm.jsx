import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getHabitante, saveHabitante } from "../services/fakeHabitantesService";

class PersonForm extends Form {
  state = {
    data: {
      name: "",
      phone: "",
      age: "",
      gender: "",
      home_address: "",
      depends_on_id: "",
    },
    errors: {},
    governor_from: "",
    houses: [],
  };

  // Front-end validation schema
  schema = {
    id: Joi.number(),
    name: Joi.string().required().label("Nombre"),
    phone: Joi.string().required().label("Teléfono"),
    age: Joi.number().required().min(0).max(100).label("Edad"),
    gender: Joi.string().required().label("Sexo"),
    home_address: Joi.string().allow("").allow(null).label("Hogar"),
    depends_on_id: Joi.number()
      .allow("")
      .allow(null)
      .label("Cédula Cabeza de Familia"),
  };

  populatePerson() {
    /*
      If the person is new, we don't need to populate the form.
      If the person is not new, we need to populate the form with the data from the server, reading the id from the URL.
    */
    try {
      const personId = this.props.match.params.id;
      if (personId === "new") return;
      const person = getHabitante(personId);

      this.setState({
        data: this.mapToViewModel(person),
        governor_from: person.governor_from,
        houses: person.houses,
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  componentDidMount() {
    this.populatePerson();
  }

  // Remember home_address and depends_on_id may be null, that's why we use the validation with '?'
  mapToViewModel(person) {
    return {
      id: person.id,
      name: person.name,
      phone: person.phone,
      age: person.age,
      gender: person.gender,
      home_address: person.home ? person.home.address : "",
      depends_on_id: person.depends_on ? person.depends_on.id : "",
    };
  }

  doSubmit = () => {
    saveHabitante(this.state.data);
    this.props.history.push("/habitantes");
  };

  render() {
    const { houses } = this.state;
    const { name: nombre_persona } = this.state.data;
    const { name: town_name } = this.state.governor_from;
    return (
      <div>
        <h1>Datos de {nombre_persona}</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Nombre")}
          {this.renderInput("phone", "Teléfono", "number")}
          {this.renderInput("age", "Edad", "number")}
          {this.renderInput("gender", "Sexo")}
          {this.renderReadOnlyLinkComponent("Gobernador de", town_name, "/")}
          {this.renderInput("home_address", "Dirección")}
          {this.renderURLReadOnlyList(
            "Viviendas",
            houses,
            "address",
            "viviendas/"
          )}
          {this.renderInput("depends_on_id", "Depende_de (cédula)")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default PersonForm;
