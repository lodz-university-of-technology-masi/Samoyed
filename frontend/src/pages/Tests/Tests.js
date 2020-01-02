import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Tests.css";
import apiRequest from "../../ApiRequest";
import Loader from "../../components/UI/Loader/Loader";
import _ from "underscore";

export default function Tests() {
  const [loaded, setLoaded] = useState(false);
  const [testsList, setTestsList] = useState([]);

  useEffect(() => {
    apiRequest({
      method: "GET",
      path: "tests",
      success: function(res) {
        setTestsList(JSON.parse(res.responseText));
        setLoaded(true);
      },
      error: function(err) {
        console.log(err);
        // ??
      }
    });
  }, []);

  function deleteTest(id) {
    let confirm = window.confirm("Czy na pewno chcesz usunąć test " + id + "?");
    if (confirm) {
      apiRequest({
        method: "DELETE",
        path: "tests/id/" + id,
        success: function(res) {
          // Update list
          let newTestList = _.filter(testsList, t => {
            if (t.id === id) return false;
            return true;
          });
          setTestsList(newTestList);
        },
        error: function(err) {
          console.log(err);
          // ??
        }
      });
    }
  }

  return loaded ? (
    <>
      <table className="table">
        <thead>
          <tr>
            <th>Tytuł</th>
            <th>Utworzono</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {testsList.map((test, i) => {
            return (
              <tr key={i}>
                <td>
                  {test.versions.map((v, j) => {
                    return <div key={j}>{"[" + v.lang + "] " + v.title}</div>;
                  })}
                </td>
                <td>{new Date(test.createdOn).toLocaleDateString()}</td>
                <td>
                  <Link to={"/test/edit/" + test.id}>
                    <button className="btn btn-primary mr-1">Edytuj</button>
                  </Link>
                  <button
                    className="btn btn-danger"
                    onClick={e => {
                      deleteTest(test.id);
                    }}
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Link to="/test/create" className="row">
        <button className="btn btn-primary col-12">Dodaj nowy test</button>
      </Link>
    </>
  ) : (
    <Loader>
      <h1>Ładowanie...</h1>
    </Loader>
  );
}
