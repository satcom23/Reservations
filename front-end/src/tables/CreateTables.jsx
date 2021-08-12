import React, { useState } from "react";
import { useHistory } from "react-router";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function CreateTable( {loadDashboard}) {
  const [errors, setErrors] = useState(null);
  const [formFields, setFormFields] = useState({
    table_name: "",
    capacity: 0,
  });
  const history = useHistory();

  function handleChange({ target }) {
    setFormFields({
      ...formFields,
      [target.name]: target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setErrors(null);
    createTable(formFields)
      .then(loadDashboard)
      .then(() => history.push("/dashboard"))
      .catch((error) => {
        setErrors(error);
      });
  }


  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="table_name">Table Name:&nbsp;</label>
          <input
            name="table_name"
            type="text"
            minLength="2"
            placeholder="table Name"
            className="form-control"
            id="table_name"
            value={formFields.table_name}
            required
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="capacity">Seats:&nbsp;</label>
          <input
            type="number"
            name="capacity"
            placeholder="Seats"
            className="form-control"
            id="capacity"
            min="1"
            required
            value={formFields.capacity}
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary mx-2">
            Submit
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={history.goBack}
          >
            Cancel
          </button>
          <ErrorAlert error={errors} />
        </div>
      </form>
    </>
  );
}
