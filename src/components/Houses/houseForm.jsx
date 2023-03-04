import React from "react";
import Joi from "joi-browser";
import withRouter from "../../services/withRouter";
import ModalSelect from "../common/ModalSelect.jsx";
import Form from "../common/form";
import { getPeople } from "../../services/peopleService";
import {
  createHouse,
  updateHouse,
  getHouse,
} from "../../services/housesService";

class HouseForm extends Form {
  state = {
    data: {
      id: "",
      address: "",
      capacity: "",
      levels: "",
      townName: null,
      residents: null,
      owners: null,
    },
    errors: {},
    showModal: false,
    allPeople: null,
  };

  schema = {
    id: Joi.number().required(),
    address: Joi.string().required().label("Dirección"),
    capacity: Joi.number().required().label("Capacidad"),
    levels: Joi.number().required().label("Niveles"),
    townName: Joi.any(),
    residents: Joi.any(),
    owners: Joi.any(),
  };

  async populateHouse() {
    try {
      const houseId = this.props.params.id;
      if (houseId === "new") return;
      const { data: house } = await getHouse(houseId);
      this.setState({
        data: this.mapToViewModel(house),
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateHouse();
    const { data: allPeople } = await getPeople();
    this.setState({ allPeople });
  }

  // Remember home_address and depends_on_id may be null, that's why we use the validation with '?'
  mapToViewModel(house) {
    console.log("The house to map is", house);
    return {
      id: house.id,
      address: house.address,
      capacity: house.capacity,
      levels: house.levels,
      townName: house.town !== null ? house.town.name : null,
      residents: house.residents,
      owners: house.owners !== [] ? house.owners : null,
    };
  }

  doSubmit = async () => {
    const { data: house } = this.state;
    const { id } = this.props.params;
    if (id === "new") {
      await createHouse(house);
    } else {
      await updateHouse(house);
    }
    // Necesitamos encontrar una mejor forma de regresar jajaja
    alert("Success now return to previous page!");
  };

  handleModalToggle = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  addOwner = (person) => {
    // First update the UI
    const { owners } = this.state.data;
    this.setState({
      data: {
        ...this.state.data,
        owners: [...owners, person],
      },
    }); // Re renders component

    // Then make an API call (Need to complete this)
  };

  render() {
    const { adress, owners } = this.state.data;
    const { showModal, allPeople } = this.state;
    return (
      <div>
        <h1>Datos de {adress}</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("address", "Dirección")}
          {this.renderInput("capacity", "Capacidad", "number")}
          {this.renderInput("levels", "Niveles", "number")}
          {this.renderInput("townName", "Municipio")}
          {this.renderURLReadOnlyList("Dueños", owners, "name", "habitantes")}
          {allPeople && (
            <ModalSelect
              options={allPeople}
              showModal={showModal}
              handleModalToggle={this.handleModalToggle}
              onSelect={this.addOwner}
            />
          )}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default withRouter(HouseForm);
