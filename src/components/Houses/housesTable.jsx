import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/table";

class housesTable extends Component {
  columns = [
    {
      key : "town",
      label: "Municipio",
      content: (house) => {
        if( house.town )  return house.town.name;
        else return "Sin municipio";
      }
    },
    {
      path: "address",
      label: "Direccion",
      content: (house) => (
        <Link to={`/viviendas/${house.id}`}>{house.address}</Link>
      ),
    },
    { path: "capacity", label: "Capacidad" },
    { path: "levels", label: "Niveles" },
    {
      key: "delete",
      content: (house) => (
        <button
          onClick={() => this.props.onDelete(house)}
          className="btn btn-danger btn-sm"
        >
          Eliminar
        </button>
      ),
    },
  ];

  render() {
    const { houses, onSort, sortColumn } = this.props;
    console.log( "housesTable: ", houses )

    return (
      <Table
        columns={this.columns}
        data={houses}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default housesTable;
