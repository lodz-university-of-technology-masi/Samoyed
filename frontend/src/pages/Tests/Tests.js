import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Tests.css";
import apiRequest from "../../ApiRequest";
import Loader from "../../components/UI/Loader/Loader";
import _ from "underscore";
import { useSelector } from "react-redux";
import Test from "../../components/Test/Test";
import ErrorModal from '../../components/ErrorModal/ErrorModal'

export default function Tests() {
  const [loaded, setLoaded] = useState(false);
  const [testsList, setTestsList] = useState([]);
  const userId = useSelector(state => state.data.sub);
  const [error, setError] = useState(false);
  const [errorData, setErrorData] = useState({ msg: "", status: "" });

  useEffect(() => {
    apiRequest({
      method: "GET",
      path: "tests",
      success: function(res) {
        console.log(JSON.parse(res.responseText));
        setTestsList(assignTestsForUser(res));
        setLoaded(true);
      },
      error: function(err) {
        console.log(err);
        setError(true);
        setErrorData({ msg : JSON.parse(err.response).error, status: err.status });
      }
    });
  }, []);

  const handleClose = () => {
    setError(false);
  };

  const assignTestsForUser = res => {
    const loadedTests = JSON.parse(res.responseText);
    const filteredTests = _.filter(loadedTests, t => {
      return t.author === userId;
    });
    return filteredTests;
  };

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
          setError(true);
          setErrorData({ msg : JSON.parse(err.response).error, status: err.status });
        }
      });
    }
  }

  if (!loaded && !error) {
    return (
      <Loader>
        <h1>Ładowanie...</h1>
      </Loader>
    )
  } else if (loaded && error) {
    return (<ErrorModal 
        err={error} 
        click={handleClose} 
        status={errorData.status} 
        msg={errorData.msg} 
      />
    )
  } else {
    return (
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
              <Test
                key={i}
                createdOn={test.createdOn}
                id={test.id}
                versions={test.versions}
                deleteTest={() => deleteTest(test.id)}
              />
            );
          })}
        </tbody>
      </table>
      <Link to="/test/create" className="row">
        <button className="btn btn-primary col-12">Dodaj nowy test</button>
      </Link>
    </>
    )
  }
}
