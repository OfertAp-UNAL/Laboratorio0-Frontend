import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import Select from "./select";
import { Link } from "react-router-dom";

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data, errors });
  };

  renderButton(label) {
    return (
      <button disabled={this.validate()} className="btn btn-primary">
        {label}
      </button>
    );
  }

  renderSelect(name, label, options) {
    const { data, errors } = this.state;

    return (
      <Select
        name={name}
        value={data[name]}
        label={label}
        options={options}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderReadOnlyLinkComponent(text_before, text_link, link) {
    if (!text_link) return null;
    return (
      <h3>
        {text_before} <Link to={link}>{text_link}</Link>
      </h3>
    );
  }

  renderURLReadOnlyList(list_title, items, display_parameter, url_prefix) {
    /*
      list_title: string to be displayed as title of the list
      items: array of objects to be displayed in the list
      display_parameter: string with the name of the parameter to search in the items list
      url_prefix: URL prefix to be used in the links
    */
    return (
      <div>
        <h4>{list_title}</h4>
        <ul>
          {items.map((item) => (
            <li key={item["id"]}>
              <Link to={`/${url_prefix}/${item["id"]}`}>
                {item[display_parameter]}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  renderInput(name, label, type = "text") {
    const { data, errors } = this.state;

    return (
      <Input
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }
}

export default Form;
