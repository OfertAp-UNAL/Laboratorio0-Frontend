import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/table";

class TownsTable extends Component {
  columns = [
    {
      path: "name",
      label: "Nombre",
      content: (town) => <Link to={`/municipios/${town.id}`}>{town.name}</Link>,
    },
    { path: "area", label: "Área" },
    { path: "budget", label: "Presupuesto" },
    {
      key: "delete",
      content: (town) => (
        <button
          onClick={() => this.props.onDelete(town)}
          className="btn btn-danger btn-sm"
        >
          Eliminar
        </button>
      ),
    },
  ];

  render() {
    const { towns, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={towns}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default TownsTable;
