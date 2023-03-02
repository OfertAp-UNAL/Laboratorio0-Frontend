import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getPerson, savePerson, addPersonHouse } from "../../services/peopleService";
import withRouter from "../../services/withRouter";
import SelectHouseModal from "./selectHouseModal";

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
      depends_on: "",
    },
    errors: {},
    showModal: false,
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
    depends_on: Joi.any(),
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
    console.log("The damn person is", person);
    return {
      id: person.id,
      name: person.name,
      phone: person.phone,
      age: person.age,
      gender: person.gender,
      depends_on_id: person.depends_on !== null ? person.depends_on.id : "",
      home: person.home.address || "",
      houses: person.houses,
    };
  }

  doSubmit = () => {
    savePerson(this.state.data);
  };

  handleModalToggle = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  handleModalSelect = (house) => {
    /*
      Receive a house with only id and name fields!
    */
    this.setState({
      data: {
        ...this.state.data,
        houses: [...this.state.data.houses, house],
      },
    });
    this.handleModalToggle();
  };

  addHouse = async house => {
    const {houses} = this.state.data
    console.log("The house you wanna add is", house);
    let houses_ids = houses.map(house => house.id)
    houses_ids.push(house.id)
    console.log("houses_ids is ", houses_ids);
    await addPersonHouse(this.state.data, houses_ids)
    await this.populatePerson(); // Re render component after deletion
  }

  render() {
    const { name: nombre_persona, houses } = this.state.data;
    return (
      <div>
        <h1>Datos de {nombre_persona}</h1>
        <form onSubmit={this.handleSubmit}>r
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
          {houses && (
            <SelectHouseModal
              showModal={this.state.showModal}
              handleModalToggle={this.handleModalToggle}
              onSelect = {this.addHouse}
            />
          )}
          {this.renderInput("depends_on_id", "Depende_de (cédula)")}

          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default withRouter(PersonForm);
