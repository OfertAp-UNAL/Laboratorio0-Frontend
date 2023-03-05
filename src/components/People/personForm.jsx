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
    showModalHome: false,
    showModalHouses: false,
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
      home: person.home,
      houses: person.houses,
    };
  }

  doSubmit = async () => {
    const { id } = this.props.params;
    const { id: homeId } = this.state.data.home;
    let housesIds = this.state.data.houses.map((house) => house.id);

    const person = {
      ...this.state.data,
      home: homeId,
      houses: housesIds,
    };

    if (id === "new") {
      await createPerson(person);
    } else {
      await updatePerson(person);
    }
    this.props.navigate("/habitantes");
  };

  handleModalToggle = (type) => {
    if (type === "home")
      this.setState({ showModalHome: !this.state.showModalHome });
    else if (type === "houses")
      this.setState({ showModalHouses: !this.state.showModalHouses });
  };

  addHouse = async (house) => {
    const { houses } = this.state.data;
    let houses_ids = houses.map((house) => house.id);
    houses_ids.push(house.id);
    await addPersonHouse(this.state.data, houses_ids);
    await this.populatePerson(); // Re render component after deletion
  };

  changeHome = (home) => {
    this.setState({
      data: {
        ...this.state.data,
        home: home,
      },
    });
  };

  render() {
    const {
      name: nombre_persona,
      houses,
      depends_on_id,
      home,
    } = this.state.data;
    const personId = this.props.params.id;
    const { allHouses, showModalHome, showModalHouses } = this.state;
    return (
      <div>
        <h1>Datos de {nombre_persona}</h1>
        {personId === "new" && <h1>Nueva persona</h1>}
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("id", "Cédula", "number")}
          {this.renderInput("name", "Nombre")}
          {this.renderInput("phone", "Teléfono")}
          {this.renderInput("age", "Edad", "number")}
          {this.renderInput("gender", "Sexo")}
          {this.renderReadOnlyLinkComponent(
            "Hogar",
            home.address,
            `/viviendas/${home.id}`
          )}

          {allHouses && ( // Check when people are loaded (since its an async call)
            <ModalSelect
              buttonName="Selecciona una dirección"
              options={allHouses || []}
              showModal={showModalHome}
              handleModalToggle={() => this.handleModalToggle("home")}
              onSelect={this.changeHome}
              nameField="address"
            />
          )}
          <br />
          {this.renderURLReadOnlyList(
            "Viviendas",
            houses,
            "address",
            "viviendas"
          )}
          {allHouses && (
            <ModalSelect
              buttonName="Añade una casa"
              options={allHouses || []}
              showModal={showModalHouses}
              handleModalToggle={() => this.handleModalToggle("houses")}
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
