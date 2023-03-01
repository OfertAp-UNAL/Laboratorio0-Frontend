import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/table";

class PeopleTable extends Component {
  columns = [
    {
      path: "name",
      label: "Nombre",
      content: (habitante) => (
        <Link to={`/habitantes/${habitante.id}`}>{habitante.name}</Link>
      ),
    },
    { path: "id", label: "Cédula" },
    { path: "phone", label: "Teléfono" },
    { path: "age", label: "Edad" },
    { path: "gender", label: "Género" },
    {
      key: "delete",
      content: (person) => (
        <button
          onClick={() => this.props.onDelete(person)}
          className="btn btn-danger btn-sm"
        >
          Eliminar
        </button>
      ),
    },
  ];

  render() {
    const { people, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={people}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default PeopleTable;
