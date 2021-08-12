import React from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";



export default function ReservationForm({handleSubmit, handleChange, errors, formFields, phoneNumberFormatter}) {
    const history = useHistory();

    return (
        <>
      <form onSubmit={handleSubmit}>
        {errors && <ErrorAlert error={errors} />}                      
        <div className="form-group">
          <label htmlFor="first_name">First Name:&nbsp;</label>
          <input
            name="first_name"
            type="text"
            placeholder="First Name"
            className="form-control"
            id="first_name"
            value={formFields.first_name}
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name:&nbsp;</label>
          <input
            name="last_name"
            type="text"
            placeholder="last_name"
            className="form-control"
            id="last_name"
            value={formFields.last_name}
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="mobile_number">Mobile Number:&nbsp;</label>
          <input
            type="tel"
            name="mobile_number"
            placeholder="XXX-XXX-XXXX"
            className="form-control"
            id="mobile_number"
            value={formFields.mobile_number}
            required
            onChange={phoneNumberFormatter}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reservation_date">Date of Reservation:&nbsp;</label>
          <input
            type="date"
            name="reservation_date"
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
            className="form-control"
            id="reservation_date"
            value={formFields.reservation_date}
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reservation_time">Time of Reservation:&nbsp;</label>
          <input
            type="time"
            name="reservation_time"
            placeholder="HH:MM"
            pattern="[0-9]{2}:[0-9]{2}"
            className="form-control"
            id="reservation_time"
            value={formFields.reservation_time}
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="people">Number In Party:&nbsp;</label>
          <input
            type="number"
            name="people"
            placeholder="Number in Party"
            className="form-control"
            id="people"
            min="1"
            required
            value={formFields.people}
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
        </div>
      </form>
    </>
    )
}