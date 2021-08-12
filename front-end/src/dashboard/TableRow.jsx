import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { clearTable } from "../utils/api";

export default function TableRow({ tables, reRender, setReRender, loadDashboard}) {
    const [error, setError] = useState(null);
    const handleClick = (table_id) => {
      setError(null);
      const abortController = new AbortController();
      if (
        window.confirm(
          "Is this table ready to seat new guests? This cannot be undone."
        )
      ) {
        clearTable(table_id, abortController.signal)
          .then(() => setReRender(!reRender))
          .catch((err) => setError(err));
      }
    };
    return (
      <div>
        <ErrorAlert error={error} />
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Table Name</th>
              <th scope="col">Capacity</th>
              <th scope="col">Status</th>
              <th scope="col">If Finished</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table, index) => {
              return (
                <tr key={index}>
                  <td>{table.table_name}</td>
                  <td>{table.capacity}</td>
                  <td data-table-id-status={table.table_id}>
                    {table.reservation_id ? "Occupied" : "Free"}
                  </td>
                  <td>
                    {table.reservation_id !== null ? (
                      <button
                        data-table-id-finish={table.table_id}
                        className="btn btn-danger"
                        onClick={() => handleClick(table.table_id)}
                      > Finish
                      </button>
                    ) : "" }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }