// import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import HabitantesTable from "./habitantesTable";
// import Pagination from "./common/pagination";
// import { paginate } from "../utils/paginate";
// import _ from "lodash";
// import SearchBox from "./searchBox";
// import {
//   getHabitantes,
//   getHabitante,
//   deleteHabitante,
// } from "../services/fakeHabitantesService";

// class Municipios extends Component {
//   state = {
//     municipios: [],
//     currentPage: 1,
//     pageSize: 4,
//     searchQuery: "",
//     sortColumn: { path: "nombre", order: "asc" },
//   };

//   async componentDidMount() {
//     // const { data: habitantes } = getHabitantes();
//     this.setState({ habitantes: getHabitantes() });
//   }

//   handleDelete = (habitante) => {
//     const habitantes = this.state.municipios.filter(
//       (h) => h._id !== habitante._id
//     );
//     this.setState({ habitantes });

//     deleteHabitante(habitante._id);
//   };

//   handlePageChange = (page) => {
//     this.setState({ currentPage: page });
//   };

//   handleSearch = (query) => {
//     this.setState({ searchQuery: query, currentPage: 1 });
//   };

//   handleSort = (sortColumn) => {
//     this.setState({ sortColumn });
//   };

//   getPagedData = () => {
//     const {
//       pageSize,
//       currentPage,
//       sortColumn,
//       searchQuery,
//       municipios: allHabitants,
//     } = this.state;

//     let filtered = allHabitants;
//     if (searchQuery)
//       filtered = allHabitants.filter((h) =>
//         h.name.toLowerCase().startsWith(searchQuery.toLowerCase())
//       );

//     const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

//     const habitantes = paginate(sorted, currentPage, pageSize);

//     return { totalCount: filtered.length, data: habitantes };
//   };

//   render() {
//     const { length: count } = this.state.municipios;
//     const { pageSize, currentPage, sortColumn, searchQuery } = this.state;

//     if (count === 0) return <p>No hay habitantes en la base de datos.</p>;

//     const { totalCount, data: habitantes } = this.getPagedData();

//     return (
//       <div className="row">
//         <div className="col-3"></div>
//         <div className="col">
//           <Link
//             to="/habitantes/new"
//             className="btn btn-primary"
//             style={{ marginBottom: 20 }}
//           >
//             Agregar Habitante
//           </Link>
//           <SearchBox value={searchQuery} onChange={this.handleSearch} />
//           <HabitantesTable
//             habitantes={habitantes}
//             sortColumn={sortColumn}
//             onDelete={this.handleDelete}
//             onSort={this.handleSort}
//           />
//           <Pagination
//             itemsCount={totalCount}
//             pageSize={pageSize}
//             currentPage={currentPage}
//             onPageChange={this.handlePageChange}
//           />
//         </div>
//       </div>
//     );
//   }
// }

// export default Municipios;
