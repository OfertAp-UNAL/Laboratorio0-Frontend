import React from "react";
import Joi from "joi-browser";
import { Link } from "react-router-dom";
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
    try {
      const personId = this.props.match.params.id;
      if (personId === "new") return;
      const person = getHabitante(personId);

      const governor_from = person.governor_from || "";

      const houses = person.houses || "";

      this.setState({
        data: this.mapToViewModel(person),
        // governor_from,
        // houses,
      });
    } catch (ex) {
      console.log("Mierda");
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  componentDidMount() {
    this.populatePerson();
  }

  mapToViewModel(person) {
    console.log("At least!");
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
    const { name: town_name, id: town_id } = this.state.governor_from;
    return (
      <div>
        <h1>Habitante Form</h1>

        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Nombre")}
          {this.renderInput("phone", "Teléfono", "number")}
          {this.renderInput("age", "Edad", "number")}
          {this.renderInput("gender", "Sexo")}
          {town_name && (
            <h3>Gobernador de {<Link to={""}>{town_name}</Link>}</h3>
          )}
          {this.renderInput("home_address", "Dirección")}

          <h4>Propiedades</h4>
          <ul>
            {houses.map((house) => (
              <li key={house["direccion"]}>
                {<Link to={"/"}>{house["direccion"]}</Link>}
              </li>
            ))}
          </ul>

          {this.renderInput("depends_on_id", "Depende_de")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default PersonForm;
