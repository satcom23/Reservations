import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NewReservation from "../reservations/NewReservation";
import CreateTable from "../tables/CreateTables";
import NotFound from "./NotFound";
import SeatReservation from "../reservations/SeatReservation";
import Search from "../reservations/Search";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import { useHistory } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import EditReservation from "../reservations/EditReservation";


/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();
  const dateQuery = query.get("date");
  const date = dateQuery ? dateQuery : today();
  const history = useHistory();
  const [reRender, setReRender] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [date, history, reRender]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/reservations/new">
        <NewReservation date={date}  />
      </Route>
      <Route path="/dashboard">
        <Dashboard
          date={date}
          reservations={reservations}
          setReservations={setReservations}
          tables={tables}
          setTables={setTables}
          reservationsError={reservationsError}
          setReservationsError={setReservationsError}
          setTablesError={setTablesError}
          tablesError={tablesError}
          loadDashboard={loadDashboard}
          reRender={reRender}
          setReRender={setReRender}
        />
      </Route>
      <Route path="/tables/new">
        <CreateTable loadDashboard={loadDashboard} />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <SeatReservation />
      </Route>
      <Route path="/search">
        <Search reRender={reRender} setReRender={setReRender} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
