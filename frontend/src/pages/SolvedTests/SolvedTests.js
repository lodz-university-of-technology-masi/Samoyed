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

  function exportCSV(id) {
    let test;
    apiRequest({
      method: "GET",
      path: "tests/id/" + id,
      success: function(res) {
        test = JSON.parse(res.responseText);

        let ver_CSV = "",
          lang,
          question = "",
          moreQuestions = "",
          answers,
          ans_res,
          title;

        ver_CSV += test.versions.length + "\n";

        for (var i = 0; i < test.versions.length; i++) {
          if (i > 0) ver_CSV += "\n";
          lang = ";" + test.versions[i].lang;
          if (lang === ";EN") {
            title = prompt(
              "Please enter title for imported test:",
              test.versions[i].title
            );
          } else {
            title = prompt(
              "Proszę wprowadzić tytuł importowanego testu:",
              test.versions[i].title
            );
          }
          title += ";" + test.versions[i].questions.length + lang;
          for (var j = 0; j < test.versions[i].questions.length; j++) {
            question =
              "\n" +
              j +
              ";" +
              test.versions[i].questions[j].type +
              ";" +
              test.versions[i].questions[j].content;
            if (test.versions[i].questions[j].type === "W") {
              // Close question
              answers = test.versions[i].questions[j].answers.split("|");
              ans_res = ";" + answers.length;
              for (var z = 0; z < answers.length; z++) {
                answers[z] = answers[z].split(";").join("=");
                ans_res += ";" + answers[z];
              }
            } else {
              ans_res = ";" + test.versions[i].questions[j].answers;
            }
            question += ans_res;
            moreQuestions += question;
          }
          ver_CSV += title + moreQuestions;
          title = "";
          moreQuestions = "";
        }

        const element = document.createElement("a");
        const file = new Blob([ver_CSV], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = "csv_export.csv";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
      },
      error: function(err) {
        console.log(err);
        // ??
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
      <SolvedTestPanel
        exportCSV={id => exportCSV(id)}
        refreshTest={() => refreshTest()}
        solvedTestsList={solvedTestsList}
      />
    );
  }
};

export default withRouter(SolvedTests);
