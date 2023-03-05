import React from "react";
import Joi from "joi-browser";
import withRouter from "../../services/withRouter";
import ModalSelect from "../common/ModalSelect.jsx";
import Form from "../common/form";
import { getPeople } from "../../services/peopleService";
import { getTowns } from "../../services/townService";
//import { Navigate, useNavigate } from "react-router-dom";
import {
  createHouse,
  updateHouse,
  getHouse,
} from "../../services/housesService";

class HouseForm extends Form {
  state = {
    data: {
      id: 0,
      address: "",
      capacity: 0,
      levels: 0,
      townId: 0,
      townName: null,
      residents: null,
      owners: [],
    },
    errors: {},
    showModalOwners: false,
    showModalTowns: false,
    allPeople: null,
    allTowns: null,
  };

  schema = {
    id: Joi.number().required(),
    address: Joi.string().required().label("Dirección"),
    capacity: Joi.number().required().label("Capacidad"),
    levels: Joi.number().required().label("Niveles"),
    townId: Joi.number().required().label("Municipio"),
    townName: Joi.string(),
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
    const { data: allTowns } = await getTowns();
    this.setState({ allPeople });
    this.setState({ allTowns });
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
      townId: house.town !== null ? house.town.id : null,
      residents: house.residents,
      owners: house.owners ? house.owners : [],
    };
  }

  genServiceData = () => {
    const { data: house } = this.state;

    return {
      name: house.name,
      address: house.address,
      capacity: house.capacity,
      levels: house.levels,
      town: house.townId,
      owners: house.owners.map((owner) => owner.id),
    };
  };

  doSubmit = async () => {
    // Update backend
    const { id } = this.props.params;
    const house_data = this.genServiceData();
    if (id === "new") {
      await createHouse(house_data);
    } else {
      await updateHouse(id, house_data);
    }
    // Return to all houses page
    this.props.navigate("/viviendas");
  };

  handleModalToggle = (type) => {
    if (type === "owners") {
      this.setState({ showModalOwners: !this.state.showModalOwners });
    } else if (type === "towns") {
      console.log("Must open towns!");
      this.setState({ showModalTowns: !this.state.showModalTowns });
    }
  };

  addOwner = (person) => {
    // First update the UI
    const { owners } = this.state.data;
    if (person) {
      this.setState({
        data: {
          ...this.state.data,
          owners: [...owners, person],
        },
      }); // Re renders component
    }
  };

  removeOwner = (person) => {
    // First update the UI
    const { owners } = this.state.data;
    this.setState({
      data: {
        ...this.state.data,
        owners: owners.filter((owner) => owner.id !== person.id),
      },
    }); // Re renders component
  };

  setTown = (town) => {
    this.setState({
      data: {
        ...this.state.data,
        townName: town.name,
        townId: town.id,
      },
    });
  };

  render() {
    const { address, owners, residents } = this.state.data;

    const { showModalOwners, showModalTowns, allPeople, allTowns } = this.state;

    return (
      <div>
        <h1>Datos de {address}</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("address", "Address")}
          <br />
          {this.renderInput("capacity", "Capacity", "number")}
          <br />
          {this.renderInput("levels", "Levels", "number")}
          <br />
          {this.renderInput("townName", "Town", "text", true)}
          <br />
          {allTowns && ( // Check when towns are loaded (since its an async call)
            <ModalSelect
              buttonName="Choose a town"
              options={allTowns || []}
              showModal={showModalTowns}
              handleModalToggle={() => this.handleModalToggle("towns")}
              onSelect={this.setTown}
            />
          )}
          <br />
          {this.renderURLReadOnlyList(
            "Owners",
            owners,
            "name",
            "habitantes",
            this.removeOwner
          )}
          <br />
          {allPeople && ( // Check when people are loaded (since its an async call)
            <ModalSelect
              buttonName="Choose an owner"
              options={allPeople || []}
              showModal={showModalOwners}
              handleModalToggle={() => this.handleModalToggle("owners")}
              onSelect={this.addOwner}
            />
          )}
          <br />

          {this.props.params.id !== "new" &&
            this.renderURLReadOnlyList(
              // Display only when not adding
              "Residents",
              residents,
              "name",
              "habitantes"
            )}
          <br />
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default withRouter(HouseForm);
