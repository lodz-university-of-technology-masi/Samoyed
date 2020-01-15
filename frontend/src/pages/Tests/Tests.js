import React, { useState, useEffect } from "react";
import "./Tests.css";
import apiRequest from "../../ApiRequest";
import Loader from "../../components/UI/Loader/Loader";
import _ from "underscore";
import { useSelector } from "react-redux";
import Test from "../../components/UI/TestPanel/Test/Test";
import ErrorModal from "../../components/ErrorModal/ErrorModal";
import TestPanel from "../../components/UI/TestPanel/TestsPanel";

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
        setTestsList(assignTestsForUser(res));
        setLoaded(true);
      },
      error: function(err) {
        console.log(err);
        setError(true);
        setErrorData({
          msg: JSON.parse(err.response).error,
          status: err.status
        });
      }
    });
  }, []);

  const handleClose = () => {
    setError(false);
  };

  const assignTestsForUser = res => {
    const loadedTests = JSON.parse(res.responseText);
    // const filteredTests = _.filter(loadedTests, t => {
    //   return t.author === userId;
    // });
    return loadedTests;
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
          setErrorData({
            msg: JSON.parse(err.response).error,
            status: err.status
          });
        }
      });
    }
  }

  function refreshTest() {
    apiRequest({
      method: "GET",
      path: "tests",
      success: function(res) {
        setTestsList(assignTestsForUser(res));
        setLoaded(true);
      },
      error: function(err) {
        console.log(err);
        setError(true);
        setErrorData({
          msg: JSON.parse(err.response).error,
          status: err.status
        });
      }
    });
  }

  if (!loaded && !error) {
    return (
      <Loader>
        <h1>Ładowanie...</h1>
      </Loader>
    );
  } else if (loaded && error) {
    return (
      <ErrorModal
        err={error}
        click={handleClose}
        status={errorData.status}
        msg={errorData.msg}
      />
    );
  } else {
    return (
      <TestPanel
        deleteTest={id => deleteTest(id)}
        refreshTest={() => refreshTest()}
        testsList={testsList}
      />
    );
  }
}
