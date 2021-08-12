import React from "react";
import { changeStatus } from "../utils/api";

export default function ReservationRow({
  reservations,
  reRender,
  setReRender,
  setReservationsError,
}) {
  function handleCancel({target}) {
    const confirm = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    if (confirm) {
      changeStatus(Number(target.id))
        .then(() => setReRender(!reRender))
        .catch(setReservationsError);
    }
  }
  return (
    <table className="table table-striped">
      <thead className="thead-dark">
        <tr>
          <th scope="col">ID</th>
          <th scope="col">First Name</th>
          <th scope="col">Last Name</th>
          <th scope="col">Mobile Number</th>
          <th scope="col">Date</th>
          <th scope="col">Time</th>
          <th scope="col">Status</th>
          <th scope="col">People</th>
          <th scope="col">Seat</th>
          <th scope="col">Edit</th>
          <th scope="col">Cancel</th>
        </tr>
      </thead>
      <tbody>
        {reservations.map((res, index) => {
          const { reservation_id } = res;
          return (
            <tr key={index}>
              <th scope="row">{res.reservation_id}</th>
              <td>{res.first_name}</td>
              <td>{res.last_name}</td>
              <td>{res.mobile_number}</td>
              <td>{res.reservation_date}</td>
              <td>{res.reservation_time}</td>
              <td data-reservation-id-status={res.reservation_id}>
                {res.status}
              </td>
              <td>{res.people}</td>
              <td>
              {res.status === "booked" ? (
                <button type="button">
                  <a
                    className="btn btn-primary"
                    href={`/reservations/${reservation_id}/seat`}
                  >
                    {" "}
                    Seat
                  </a>
                </button>
              ) : (
                res.status
              )}
              </td>
              <td>
              {res.status === "booked" ? (
                <button type="button">
                  <a
                    className="btn btn-primary"
                    href={`/reservations/${reservation_id}/edit`}
                  >
                    {" "}
                     Edit
                  </a>
                </button>
              ) : (
                res.status
              )}
              </td>
              <td>
              {res.status === "booked" ? (
                <button type="button" id={res.reservation_id} data-reservation-id-cancel={res.reservation_id} onClick={handleCancel}>
                     Cancel
                </button>
              ) : (
                res.status
              )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
