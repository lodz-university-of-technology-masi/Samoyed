import React, { useState, useEffect, useCallback } from "react";
import "./SolvedTests.css";
import apiRequest from "../../ApiRequest";
import Loader from "../../components/UI/Loader/Loader";
import ErrorModal from "../../components/ErrorModal/ErrorModal";
import SolvedTestPanel from "../../components/UI/SolvedTestPanel/SolvedTestsPanel";
import { withRouter } from "react-router";

const SolvedTests = () => {
  const [loaded, setLoaded] = useState(false);
  const [solvedTestsList, setSolvedTestsList] = useState([]);
  const [error, setError] = useState(false);
  const [errorData, setErrorData] = useState({ msg: "", status: "" });

  const refreshTest = useCallback(() => {
    apiRequest({
      method: "GET",
      path: "SolvedTestsGetForUser",
      success: function(res) {
        setSolvedTestsList(JSON.parse(res.responseText));
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
  },[])

  useEffect(() => {
      apiRequest({
        method: "GET",
        path: "SolvedTestsGetForUser",
        success: function(res) {
          setSolvedTestsList(JSON.parse(res.responseText));
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
      <SolvedTestPanel
        refreshTest={() => refreshTest()}
        solvedTestsList={solvedTestsList}
      />
    );
  }
};

export default withRouter(SolvedTests);
