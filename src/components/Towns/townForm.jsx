import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getTown, saveTown } from "../../services/townService";
import withRouter from "../../services/withRouter";

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
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default withRouter(TownForm);
