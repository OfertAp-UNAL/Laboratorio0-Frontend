import React, { Component } from "react";
import { Link } from "react-router-dom";
import Pagination from "../common/pagination";
import { paginate } from "../../utils/paginate";
import _ from "lodash";
import SearchBox from "../common/searchBox";
import TownsTable from "./townsTable";
import { getTowns, deleteTown } from "../../services/townService";

class Towns extends Component {
  state = {
    towns: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    sortColumn: { path: "name", order: "asc" },
  };

  async componentDidMount() {
    const { data: towns } = await getTowns();
    this.setState({ towns });
  }

  handleDelete = async (town) => {
    const towns = this.state.towns.filter((t) => t.id !== town._id);
    this.setState({ towns });

    await deleteTown(town.id);
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      towns: allTowns,
    } = this.state;

    let filtered = allTowns;
    if (searchQuery)
      filtered = allTowns.filter((t) =>
        t.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const towns = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: towns };
  };

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;

    const { totalCount, data: towns } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-3"></div>
        <div className="col">
          <Link
            to="/municipios/new"
            className="btn btn-primary"
            style={{ marginBottom: 20 }}
          >
            Agregar Municipio
          </Link>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <TownsTable
            towns={towns}
            sortColumn={sortColumn}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Towns;
