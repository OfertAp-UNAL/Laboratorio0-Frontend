import React from "react";
import Joi from "joi-browser";
import withRouter from "../../services/withRouter";
import ModalSelect from "../common/ModalSelect.jsx";
import Form from "../common/form";
import {
  getPerson,
  createPerson,
  updatePerson,
  addPersonHouse,
} from "../../services/peopleService";
import { getHouses } from "../../services/housesService";

class PersonForm extends Form {
  state = {
    data: {
      id: "",
      name: "",
      phone: "",
      age: "",
      gender: "",
      governor_from: "",
      home: "",
      houses: "",
      depends_on_id: "",
    },
    errors: {},
    showModal: false,
    allHouses: null,
  };

  // Front-end validation schema. governor_from is not validated because it is a read-only field.

  schema = {
    id: Joi.number().required().label("Cédula"),
    name: Joi.string().required().label("Nombre"),
    phone: Joi.string().required().label("Teléfono"),
    age: Joi.number().required().min(0).max(100).label("Edad"),
    gender: Joi.string().required().label("Sexo"),
    governor_from: Joi.any(),
    home: Joi.any(),
    home_id: Joi.number().allow("").allow(null).label("Hogar"),
    houses: Joi.any(),
    depends_on_id: Joi.any(),
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
    const { data: allHouses } = await getHouses();
    this.setState({ allHouses });
  }

  // Remember home_address and depends_on_id may be null, that's why we use the validation with '?'
  mapToViewModel(person) {
    console.log("The person to map is", person);
    return {
      id: person.id,
      name: person.name,
      phone: person.phone,
      age: person.age,
      gender: person.gender,
      depends_on_id: person.depends_on !== null ? person.depends_on.id : null,
      home: person.home !== null ? person.home.address : null,
      houses: person.houses,
    };
  }

  doSubmit = async () => {
    const { data: person } = this.state;
    const { id } = this.props.params;
    if (id === "new") {
      await createPerson(person);
    } else {
      await updatePerson(person);
    }
    this.props.navigate("/habitantes");
  };

  handleModalToggle = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  addHouse = async (house) => {
    const { houses } = this.state.data;
    let houses_ids = houses.map((house) => house.id);
    houses_ids.push(house.id);
    await addPersonHouse(this.state.data, houses_ids);
    await this.populatePerson(); // Re render component after deletion
  };

  render() {
    const { name: nombre_persona, houses, depends_on_id } = this.state.data;
    return (
      <div>
        <h1>Datos de {nombre_persona}</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("id", "Cédula", "number")}
          {this.renderInput("name", "Nombre")}
          {this.renderInput("phone", "Teléfono")}
          {this.renderInput("age", "Edad", "number")}
          {this.renderInput("gender", "Sexo")}
          {this.renderInput("home", "Dirección")}
          {this.renderURLReadOnlyList(
            "Viviendas",
            houses,
            "address",
            "viviendas"
          )}
          {this.state.allHouses && (
            <ModalSelect
              options={this.state.allHouses}
              showModal={this.state.showModal}
              handleModalToggle={this.handleModalToggle}
              onSelect={this.addHouse}
              nameField="address"
            />
          )}
          {depends_on_id &&
            this.renderInput("depends_on_id", "Depende_de (cédula)")}

          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default withRouter(PersonForm);
