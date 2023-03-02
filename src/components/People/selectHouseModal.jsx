import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import { getHouses } from "../../services/housesService";


class SelectHouseModal extends Component {
  state = {
    baseOptions: [],
    filteredOptions: [],
    searchQuery: "",
    selectedOption: "",
  }

  async componentDidMount() {
    this.setState({searchQuery: "", filteredOptions: [], selectedOption: ""})
    console.log("Houses loading...");
    const {data: houses} = await getHouses()
    console.log("Houses loaded...")
    this.setState({baseOptions: houses})
  }

  updateFilteredOptions = () => {
    const {baseOptions, searchQuery} = this.state
    const filteredOptions = baseOptions.filter( option => option.address.toLowerCase().includes(searchQuery.toLowerCase().trim()))
    this.setState({filteredOptions})
  }

  handleSuggestionClick = option => {
    const id = option.id
    const address = option.address
    const selectedOption = {"id": id, "address": address}
    this.setState({searchQuery: address, selectedOption})
    this.updateFilteredOptions()
  }

  handleChange = event => {
    const address = event.target.value || ""
    this.setState({searchQuery: address})
    this.updateFilteredOptions()
  }

  sendForm = () => {
    console.log("Will call this with", this.state.selectedOption);
    this.props.onSelect(this.state.selectedOption)
    this.props.handleModalToggle(this.state.selectedOption)
  }

  render() {
    const {searchQuery, filteredOptions} = this.state
    console.log(this.state.baseOptions)
    return(
      <div>
        <Button onClick={this.props.handleModalToggle}>Add House</Button>
        <Modal
          show={this.props.showModal}
          onHide={this.props.handleModalToggle}
        >
          <Modal.Header closeButton>
            <Modal.Title>Modal Title</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <input type="text" value={searchQuery} onChange={this.handleChange} />
              <ul>
                {filteredOptions.map((option) => (
                  <li
                    key={option.id}
                    onClick={() => this.handleSuggestionClick(option)}
                  >
                    {option.address}
                  </li>
                ))}
              </ul>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.sendForm}>Send</Button>
          </Modal.Footer>
        </Modal>{" "}
      </div>
    )
  }

}

export default SelectHouseModal;
