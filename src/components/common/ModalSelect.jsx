import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";



class ModalSelect extends Component {
  state = {
    baseOptions: [],
    filteredOptions: [],
    searchQuery: "",
    selectedOption: "",
    nameField: ""
  }


  async componentDidMount() {
    const nameField = this.props.nameField || "name";
    console.log("The name field here is", nameField);
    this.setState({searchQuery: "", filteredOptions: [], selectedOption: "", baseOptions: this.props.options, nameField})
  }

  updateFilteredOptions = () => {
    const {baseOptions, searchQuery, nameField} = this.state
    const filteredOptions = baseOptions.filter( option => option[nameField].toLowerCase().includes(searchQuery.toLowerCase().trim()))
    this.setState({filteredOptions})
  }

  handleSuggestionClick = option => {
    const {nameField} = this.props
    const id = option.id
    const name = option[nameField]
    const selectedOption = {"id": id, [nameField]: name }
    this.setState({searchQuery: name, selectedOption})
    this.updateFilteredOptions()
  }

  handleChange = event => {
    const name = event.target.value || ""
    this.setState({searchQuery: name})
    this.updateFilteredOptions()
  }

  sendForm = () => {
    this.props.onSelect(this.state.selectedOption)
    this.props.handleModalToggle(this.state.selectedOption)
  }

  render() {
    const {searchQuery, filteredOptions, nameField} = this.state
    return(
      <div>
        <Button onClick={this.props.handleModalToggle}>Add</Button>
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
                    {option[nameField]}
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

export default ModalSelect;
