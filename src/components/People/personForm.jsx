import React from "react";
import Joi from "joi-browser";
import withRouter from "../../services/withRouter";
import ModalSelect from "../common/ModalSelect.jsx";
import Form from "../common/form";
import { toast } from "react-toastify";
import {
  getPerson,
  createPerson,
  updatePerson,
} from "../../services/peopleService";
import { getHouses } from "../../services/housesService";

class PersonForm extends Form {
  state = {
    data: {
      id: 0,
      name: "",
      phone: "",
      age: 0,
      gender: "",
      governed_town: 0,
      home: {},
      houses: [],
      depends_on_id: "",
    },
    errors: {},
    showModalHome: false,
    showModalHouses: false,
    allHouses: [],
  };

  // Front-end validation schema. governor_from is not validated because it is a read-only field.

  schema = {
    id: Joi.number().required().label("Cédula"),
    name: Joi.string().required().label("Nombre"),
    phone: Joi.string().required().label("Teléfono"),
    age: Joi.number().required().min(0).max(100).label("Edad"),
    gender: Joi.string().required().valid("M", "F", "O").label("Sexo"),
    governed_town: Joi.any(),
    home: Joi.any(),
    houses: Joi.any(),
    depends_on_id: Joi.any(),
    dependences: Joi.any(),
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
        this.props.navigate("/not-found");
    }
  }

  async componentDidMount() {
    await this.populatePerson();

    try {
      const { data: allHouses } = await getHouses();
      this.setState({ allHouses });
    } catch (e) {
      toast.error("No se pudo cargar la lista de casas");
    }
  }

  // Remember home_address and depends_on_id may be null, that's why we use the validation with '?'
  mapToViewModel(person) {
    return {
      id: person.id,
      name: person.name,
      phone: person.phone,
      age: person.age,
      gender: person.gender,
      depends_on_id: person.depends_on ? person.depends_on.id : "",
      home: person.home ? person.home : {},
      houses: person.houses ? person.houses : [],
      dependences: person.dependences ? person.dependences : [],
    };
  }

  doSubmit = async () => {
    const { id } = this.props.params;
    const { id: homeId } = this.state.data.home;
    const depends_on_id = this.state.data.depends_on_id;
    const housesIds = this.state.data.houses.map((house) => house.id);

    const person = {
      ...this.state.data,
      home: homeId,
      houses: housesIds,
      depends_on: depends_on_id,
    };

    try {
      if (id === "new") {
        await createPerson(person);
      } else {
        await updatePerson(person);
      }
      this.props.navigate("/habitantes");
    } catch (e) {
      toast("No se pudo guardar la persona");
    }
  };

  handleModalToggle = (type) => {
    if (type === "home")
      this.setState({ showModalHome: !this.state.showModalHome });
    else if (type === "houses")
      this.setState({ showModalHouses: !this.state.showModalHouses });
  };

  addHouse = async (house) => {
    if (house) {
      const { houses } = this.state.data;

      this.setState({
        data: {
          ...this.state.data,
          houses: [...houses, house],
        },
      });
    }
  };

  changeHome = (home) => {
    if (home) {
      this.setState({
        data: {
          ...this.state.data,
          home: home,
        },
      });
    }
  };

  render() {
    const { name: nombre_persona, houses, home, dependences } = this.state.data;
    const personId = this.props.params.id;
    const { allHouses, showModalHome, showModalHouses } = this.state;
    return (
      <div>
        <h1>Datos de {nombre_persona}</h1>
        {personId === "new" && <h1>Nueva persona</h1>}
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("id", "Cédula", "number")}
          <br />
          {this.renderInput("name", "Nombre")}
          <br />
          {this.renderInput("phone", "Teléfono")}
          <br />
          {this.renderInput("age", "Edad", "number")}
          <br />
          {this.renderInput("gender", "Sexo")}
          <br />
          {this.renderReadOnlyLinkComponent(
            "Hogar",
            home.address,
            `/viviendas/${home.id}`
          )}
          <br />

          {allHouses.length > 0 && ( // Check when people are loaded (since its an async call)
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
          <br />
          {allHouses.length > 0 && (
            <ModalSelect
              buttonName="Añade una propiedad"
              options={allHouses || []}
              showModal={showModalHouses}
              handleModalToggle={() => this.handleModalToggle("houses")}
              onSelect={this.addHouse}
              nameField="address"
            />
          )}
          <br />
          {this.renderInput("depends_on_id", "Depende_de (cédula)")}
          <br />
          {this.renderURLReadOnlyList(
            "Dependientes",
            dependences,
            "name",
            "habitantes"
          )}
          {this.renderButton("Save")}
          {this.errors &&
            this.validate() &&
            this.errors.map((error) => (
              <div key={error} className="alert alert-danger">
                {error}
              </div>
            ))}
        </form>
      </div>
    );
  }
}

export default withRouter(PersonForm);
