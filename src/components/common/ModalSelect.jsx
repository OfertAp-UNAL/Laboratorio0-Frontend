import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";

class ModalSelect extends Component {
  state = {
    baseOptions: [],
    filteredOptions: [],
    searchQuery: "",
    selectedOption: null,
    nameField: "",
    buttonName: "",
  };

  async componentDidMount() {
    const nameField = this.props.nameField || "name";
    const buttonName = this.props.buttonName || "Add";
    this.setState({
      baseOptions: this.props.options,
      filteredOptions: [],
      searchQuery: "",
      selectedOption: null,
      nameField,
      buttonName,
    });
  }

  updateFilteredOptions = () => {
    const { baseOptions, searchQuery, nameField } = this.state;
    const filteredOptions = baseOptions.filter((option) =>
      option[nameField].toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
    this.setState({ filteredOptions });
  };

  handleSuggestionClick = (option) => {
    const { nameField } = this.state;
    const name = option[nameField];
    const selectedOption = { id: option.id, [nameField]: name };
    this.setState({ searchQuery: name, selectedOption });
    this.updateFilteredOptions();
  };

  handleChange = (event) => {
    const name = event.target.value || "";
    this.setState({ searchQuery: name });
    this.updateFilteredOptions();
  };

  sendForm = () => {
    const { onSelect, handleModalToggle } = this.props;
    const { selectedOption } = this.state;
    onSelect(selectedOption);
    handleModalToggle(selectedOption);
  };

  render() {
    const { searchQuery, filteredOptions, nameField } = this.state;
    return (
      <div>
        <Button onClick={this.props.handleModalToggle}>
          {this.state.buttonName}
        </Button>
        <Modal
          show={this.props.showModal}
          onHide={this.props.handleModalToggle}
        >
          <Modal.Header closeButton>
            <Modal.Title>Select</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <input
                type="text"
                value={searchQuery}
                onChange={this.handleChange}
              />
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
    );
  }
}

export default ModalSelect;
