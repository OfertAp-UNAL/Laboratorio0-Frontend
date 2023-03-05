import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getTown, createTown, updateTown } from "../../services/townService";
import withRouter from "../../services/withRouter";
import ModalSelect from "../common/ModalSelect.jsx";
import { getHouses } from "../../services/housesService";
import { getPeople } from "../../services/peopleService";

class TownForm extends Form {
  state = {
    data: {
      id: 0,
      houses: [],
      name: "",
      area: 0,
      budget: 0,
      governorId: null,
      governorName: null,
    },
    errors: {},
    showModalGovernor: false,
    showModalHouses: false,
    allHouses: null,
    allPersons: null,
  };

  // Joi.any fields means there's no validation
  schema = {
    id: Joi.number().required(),
    governorId: Joi.number().required().label("Gobernador"),
    governorName: Joi.string(),
    name: Joi.string().required().label("Nombre"),
    area: Joi.number().required().label("Área"),
    budget: Joi.number().required().label("Presupuesto"),
    houses: Joi.any(),
  };

  async populateTown() {
    try {
      const townId = this.props.params.id;
      if (townId === "new") return;
      const { data: town } = await getTown(townId);
      console.log(town);
      this.setState({
        data: this.mapToViewModel(town),
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.navigate("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateTown();
    const { data: allHouses } = await getHouses();
    const { data: allPersons } = await getPeople();
    this.setState({ allHouses });
    this.setState({ allPersons });
  }

  // Remember home_address and depends_on_id may be null, that's why we use the validation with '?'
  mapToViewModel(town) {
    return {
      id: town.id,
      houses: town.houses || "",
      governorId: town.governor ? town.governor.id : null,
      governorName: town.governor ? town.governor.name : null,
      name: town.name,
      area: town.area,
      budget: town.budget,
    };
  }

  handleModalToggle = (type) => {
    if (type === "governor") {
      this.setState({ showModalGovernor: !this.state.showModalGovernor });
    } else if (type === "houses") {
      this.setState({ showModalHouses: !this.state.showModalHouses });
    }
  };

  addHouse = async (house) => {
    // First update the UI
    const { houses } = this.state.data;
    if (house) {
      this.setState({
        data: {
          ...this.state.data,
          houses: [...houses, house],
        },
      }); // Re renders component
    }
  };

  setGovernor = async (person) => {
    console.log(person);
    // First update the UI
    if (person) {
      this.setState({
        data: {
          ...this.state.data,
          governorId: person.id,
          governorName: person.name,
        },
      }); // Re renders component
      console.log(this.state.data.governorId);
      console.log(this.state.data.governorName);
    }
  };

  genServiceData = () => {
    const { data: town } = this.state;

    return {
      name: town.name,
      area: town.area,
      budget: town.budget,
      governor: town.governorId,
    };
  };

  doSubmit = async () => {
    const town = this.genServiceData();
    console.log("town", town);
    const { id } = this.props.params;
    if (id === "new") {
      await createTown(town);
    } else {
      await updateTown(id, town);
    }
    this.props.navigate("/municipios");
  };

  render() {
    const { name: town_name, houses } = this.state.data;
    return (
      <div>
        <h1>Datos de {town_name}</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Nombre")}
          <br />
          {this.renderInput("governorName", "Gobernador", "text", true)}
          <br />
          {this.state.allPersons && (
            <ModalSelect
              options={this.state.allPersons}
              showModal={this.state.showModalGovernor}
              handleModalToggle={() => this.handleModalToggle("governor")}
              onSelect={this.setGovernor}
              nameField="name"
              buttonName="Choose a governor"
            />
          )}
          <br />
          {this.renderInput("area", "Área")}
          <br />
          {this.renderInput("budget", "Presupuesto")}
          <br />
          {this.renderURLReadOnlyList(
            "Viviendas",
            houses,
            "address",
            "viviendas"
          )}
          {this.state.allHouses && (
            <ModalSelect
              options={this.state.allHouses}
              showModal={this.state.showModalHouses}
              handleModalToggle={() => this.handleModalToggle("houses")}
              onSelect={this.addHouse}
              nameField="address"
              buttonName="Choose a house"
            />
          )}
          <br />
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default withRouter(TownForm);
