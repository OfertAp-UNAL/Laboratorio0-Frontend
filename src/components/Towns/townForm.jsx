import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getTown, saveTown } from "../../services/townService";
import withRouter from "../../services/withRouter";
import ModalSelect from "../common/ModalSelect.jsx";
import { getHouses } from "../../services/housesService";

class TownForm extends Form {
  state = {
    data: {
      id: "",
      houses: "",
      governor: "",
      name: "",
      area: "",
      budget: "",
    },
    errors: {},
    showModal: false,
    allHouses: null
  };

  // Joi.any fields means there's no validation
  schema = {
    id: Joi.number().required(),
    houses: Joi.any(),
    governor: Joi.any(),
    name: Joi.string().required().label("Nombre"),
    area: Joi.number().required().label("Área"),
    budget: Joi.number().required().label("Presupuesto"),
  };

  async populateTown() {
    try {
      const townId = this.props.params.id;
      if (townId === "new") return;
      const { data: town } = await getTown(townId);
      this.setState({
        data: this.mapToViewModel(town),
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateTown();
    const {data: allHouses} = await getHouses();
    this.setState({allHouses});
  }

  // Remember home_address and depends_on_id may be null, that's why we use the validation with '?'
  mapToViewModel(town) {
    return {
      id: town.id,
      houses: town.houses || "",
      governor: town.governor || "",
      name: town.name,
      area: town.area,
      budget: town.budget,
    };
  }

  handleModalToggle = () => {
    this.setState({ showModal: !this.state.showModal });
  };


  addHouse = async house => {
    // First update the UI
    const {houses} = this.state.data
    this.setState({
      data: {
        ...this.state.data,
        houses: [...houses, house],
      },
    });  // Re renders component

    // Then make an API call (Need to complete this)
  }

  doSubmit = () => {
    saveTown(this.state.data);
  };

  render() {
    const { name: town_name, houses } = this.state.data;
    return (
      <div>
        <h1>Datos de {town_name}</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("id", "Cédula", "number")}
          {this.renderInput("name", "Nombre")}
          {this.renderInput("governor", "Gobernador")}
          {this.renderInput("area", "Área")}
          {this.renderInput("budget", "Presupuesto")}
          {this.renderURLReadOnlyList(
            "Viviendas",
            houses,
            "address",
            "viviendas"
          )}
          {this.state.allHouses && <h5>Loaded</h5>}
          {this.state.allHouses && (
            <ModalSelect
              options = {this.state.allHouses}
              showModal={this.state.showModal}
              handleModalToggle={this.handleModalToggle}
              onSelect = {this.addHouse}
              nameField = "address"
            />
          )}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default withRouter(TownForm);
