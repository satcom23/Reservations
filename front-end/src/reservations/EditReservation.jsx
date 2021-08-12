import React, {useState, useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";
import {formatPhoneNumber, updateReservation, readReservation} from "../utils/api";
import {today} from "../utils/date-time"
import ReservationForm from "./ReservationForm";

export default function EditReservation() {
    const [error, setError] = useState(null);
  const [formFields, setFormFields] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  });
  const {reservation_id} = useParams();
  useEffect(() => {
    const abortController = new AbortController();


    readReservation(reservation_id, abortController.signal)
      .then((res) => {
        setFormFields(res);
      })
      .catch(setError);
  }, [reservation_id]);
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
      setError(new Error(message));
      return false;
    }
    return true;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    const validDate = validateDate();
    if (validDate) {
      updateReservation(formFields)
        .then(() => history.push(`/dashboard?date=${formFields.reservation_date}`))
        .catch((err) => setError(err));
    }
  } 
  function handleChange({target}) {
    setFormFields({
      ...formFields,
      [target.name]: target.value,
    })
            
  }
  return (
    <ReservationForm
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      formFields={formFields}
      errors={error}
      phoneNumberFormatter={phoneNumberFormatter}
    />
  );
}