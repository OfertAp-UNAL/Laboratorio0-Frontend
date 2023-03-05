import React, { Component } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import Pagination from "../common/pagination";
import { paginate } from "../../utils/paginate";
import SearchBox from "../common/searchBox";
import HousesTable from "./housesTable";
import { getHouses, deleteHouse } from "../../services/housesService";

class House extends Component {
  state = {
    houses: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    sortColumn: { path: "?????????????", order: "asc" },
  };

  async componentDidMount() {
    const { data: houses } = await getHouses();
    this.setState({ houses });
  }

  handleDelete = async (house) => {
    const houses = this.state.houses.filter((h) => h.id !== house.id);
    this.setState({ houses });
    await deleteHouse(house.id); // Remove in the database
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
      houses: allHabitants,
    } = this.state;

    let filtered = allHabitants;
    if (searchQuery)
      filtered = allHabitants.filter((p) =>
        p.address.toString().toLowerCase().startsWith(searchQuery.toLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const people = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: people };
  };

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;

    const { totalCount, data: houses } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-3"></div>
        <div className="col">
          <Link
            to="/viviendas/new"
            className="btn btn-primary"
            style={{ marginBottom: 20 }}
          >
            Agregar Vivienda
          </Link>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <HousesTable
            houses={houses}
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

export default House;
