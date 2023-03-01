import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import SearchBox from "../searchBox";

class SelectHouseModal extends Component {
  state = {
    searchQuery: "",
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query });
  };

  render() {
    return (
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
            <SearchBox
              value={this.state.searchQuery}
              onChange={this.handleSearch}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.handleModalToggle}>Close</Button>
          </Modal.Footer>
        </Modal>{" "}
      </div>
    );
  }
}

export default SelectHouseModal;
