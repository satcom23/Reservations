import React from "react";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationRow from "./ReservationRow";
import TableRow from "./TableRow";
import { previous, today, next } from "../utils/date-time";
import { useHistory } from "react-router-dom";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({
  date,
  reservations,
  setReservations,
  tables,
  setTables,
  reservationsError,
  setReservationsError,
  tablesError,
  setTablesError,
  loadDashboard,
  reRender,
  setReRender,
}) {
  const history = useHistory(); 


  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <div>
        <button
          type="button"
          onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => history.push(`/dashboard?date=${today()}`)}
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => history.push(`/dashboard?date=${next(date)}`)}
        >
          Next
        </button>
      </div>
      <div>
        <ReservationRow
          reservations={reservations}
          reRender={reRender}
          setReRender={setReRender}
          reservationsError={reservationsError}
          setReservationsError={setReservationsError}
          loadDashboard={loadDashboard}
        />

        <ErrorAlert error={reservationsError} />

        <TableRow
          tables={tables}
          reRender={reRender}
          setReRender={setReRender}
          loadDashboard={loadDashboard}
        />

        <ErrorAlert error={tablesError} />
      </div>
    </main>
  );
}

export default Dashboard;
