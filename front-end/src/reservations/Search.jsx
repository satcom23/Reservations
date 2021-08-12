import React, { useState } from "react";
import { listReservationsbyNumber } from "../utils/api";
import ReservationRow from "../dashboard/ReservationRow";
import ErrorAlert from "../layout/ErrorAlert";

export default function Search({reRender, setReRender}) {
  const [reservationList, setReservationList] = useState([]);
  const [number, setNumber] = useState("");
  const [error, setError] = useState(null);
  
  function changeHandler({ target }) {
    setNumber(() => target.value);
  }

  const loadReservations = async (number) => {
      const abortController = new AbortController();
    setError(null);
    listReservationsbyNumber( {number} , abortController.signal)
      .then((res) => {
        setReservationList(res);
        if (!res.length) {
          setError({ message: "No reservations found" });
        }
      })
      .catch(setError);
  };

  function handleSubmit(event) {
    event.preventDefault();
    loadReservations(number);
    setReRender(!reRender);
  }


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="mobile_number">Search by Phone Number</label>
        <input
          name="mobile_number"
          id="mobile_number"
          type="tel"
          value={number}
          required
          onChange={changeHandler}
          placeholder="555-555-5555"
        />
        <button type="submit">Find</button>
      </form>
      <ErrorAlert error={error} />
      <ReservationRow reservations={reservationList} />
    </div>
  );
}
