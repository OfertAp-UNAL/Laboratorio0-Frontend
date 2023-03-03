import React, { Component } from "react";
import { Link } from "react-router-dom";
import PeopleTable from "./peopleTable";
import Pagination from "../common/pagination";
import { paginate } from "../../utils/paginate";
import _ from "lodash";
import SearchBox from "../searchBox";
import { getPeople, deletePerson } from "../../services/peopleService";

class People extends Component {
  state = {
    people: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    sortColumn: { path: "name", order: "asc" },
  };

  async componentDidMount() {
    const { data: people } = await getPeople();
    this.setState({ people });
  }

  handleDelete = async (person) => {
    const people = this.state.people.filter(p => p.id !== person.id)
    this.setState({people})
    await deletePerson(person.id)  // Remove in the database
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
      people: allHabitants,
    } = this.state;


    let filtered = allHabitants;
    if (searchQuery)
      filtered = allHabitants.filter((p) =>
        p.id.toString().startsWith(searchQuery.toLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const people = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: people };
  };

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;

    const { totalCount, data: people } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-3"></div>
        <div className="col">
          <Link
            to="/habitantes/new"
            className="btn btn-primary"
            style={{ marginBottom: 20 }}
          >
            Agregar Habitante
          </Link>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <PeopleTable
            people={people}
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

export default People;
