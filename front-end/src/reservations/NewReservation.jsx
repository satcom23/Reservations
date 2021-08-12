import React, { useState } from "react";
import { useHistory } from "react-router";
import { today } from "../utils/date-time";
import { createReservation, formatPhoneNumber } from "../utils/api";
import ReservationForm from "./ReservationForm";

export default function NewReservation({ date, loadDashboard }) {
  const [errors, setErrors] = useState(null);
  const [formFields, setFormFields] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  });
  const history = useHistory();
  const phoneNumberFormatter = ({ target }) => {
    const formattedInputValue = formatPhoneNumber(target.value);
    setFormFields({
      ...formFields,
      mobile_number: formattedInputValue,
    });
  };

  function validateDate() {
    const reserveDate = new Date(formFields.reservation_date);
    const reserveTime = formFields.reservation_time;
    let message = "";

    if (reserveDate.getDay() === 1) {
      message +=
        "Reservations cannot be made on a Tuesday (Restaurant is closed).";
    }
    if (formFields.reservation_date < today()) {
      message += "Reservations cannot be made in the past.";
    }

    if (reserveTime.localeCompare("10:30") === -1) {
      message += "We are closed before 10:30AM";
    } else if (reserveTime.localeCompare("21:30") === 1) {
      message += "We are closed after 9:30PM";
    } else if (reserveTime.localeCompare("21:00") === 1) {
      message +=
        "You must book at least 30 minutes before the restaurant closes";
    }

    if (message) {
      setErrors(new Error(message));
      return false;
    }
    return true;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setErrors(null);
    const validDate = validateDate();
    if (validDate) {
      createReservation(formFields)
        .then(() =>
          history.push(`/dashboard?date=${formFields.reservation_date}`)
        )
        .catch((err) => setErrors(err));
    }
  }
  function handleChange({ target }) {
    setFormFields({
      ...formFields,
      [target.name]: target.value,
    });
  }
  return (
    <ReservationForm
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      formFields={formFields}
      errors={errors}
      phoneNumberFormatter={phoneNumberFormatter}
    />
  );
}
