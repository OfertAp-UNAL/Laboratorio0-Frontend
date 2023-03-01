import React from "react";
import Joi from "joi-browser";
import { useParams, useNavigate } from "react-router-dom";
import Form from "../common/form";
import { getPerson, savePerson } from "../../services/peopleService";
import withRouter from "../../services/withRouter";

class PersonForm extends Form {
  state = {
    data: {
      id: "",
      name: "",
      phone: "",
      age: "",
      gender: "",
      governor_from: "",
      home_town: "IDK",
      home_id: "",
      houses: [],
      depends_on_id: "",
    },
    errors: {},
  };

  // Front-end validation schema. governor_from is not validated because it is a read-only field.

  schema = {
    id: Joi.number().required().label("Cédula"),
    name: Joi.string().required().label("Nombre"),
    phone: Joi.string().required().label("Teléfono"),
    age: Joi.number().required().min(0).max(100).label("Edad"),
    gender: Joi.string().required().label("Sexo"),
    home_town: Joi.string().allow("").allow(null).label("Municipio"),
    home_id: Joi.number().allow("").allow(null).label("Hogar"),
    houses: Joi.any(),
    governor_from: Joi.any(),

    depends_on_id: Joi.number()
      .allow("")
      .allow(null)
      .label("Cédula Cabeza de Familia"),
  };

  async populatePerson() {
    /*
      If the person is new, we don't need to populate the form.
      If the person is not new, we need to populate the form with the data from the server, reading the id from the URL.
    */
    try {
      const personId = this.props.params.id;
      if (personId === "new") return;
      const { data: person } = await getPerson(personId);
      this.setState({
        data: this.mapToViewModel(person),
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populatePerson();
  }

  // Remember home_address and depends_on_id may be null, that's why we use the validation with '?'
  mapToViewModel(person) {
    return {
      id: person.id,
      name: person.name,
      phone: person.phone,
      age: person.age,
      gender: person.gender,
      home_id: person.home || "",
      houses: person.houses,
      depends_on_id: person.depends_on !== null ? person.depends_on : "",
    };
  }

  doSubmit = () => {
    savePerson(this.state.data);
  };

  render() {
    console.log("Props:", this.props);
    const { name: nombre_persona, houses } = this.state.data;
    return (
      <div>
        <h1>Datos de {nombre_persona}</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("id", "Cédula", "number")}
          {this.renderInput("name", "Nombre")}
          {this.renderInput("phone", "Teléfono")}
          {this.renderInput("age", "Edad", "number")}
          {this.renderInput("gender", "Sexo")}
          {this.renderInput("home_id", "Dirección")}
          {this.renderURLReadOnlyList(
            "Viviendas",
            houses,
            "address",
            "viviendas"
          )}
          {this.renderInput("depends_on_id", "Depende_de (cédula)")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default withRouter(PersonForm);
