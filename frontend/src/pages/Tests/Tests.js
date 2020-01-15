import React, { useState, useEffect, version} from "react";
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

  function exportCSV(id) {
    let test
    apiRequest({
			method: "GET",
			path: "tests/id/" + id,
			success: function(res) {
				test = JSON.parse(res.responseText)

        let ver_CSV = ""
        let lang
        let question ="";
        let moreQuestions ="";
        let answers
        let ans_res
        let title 

        for(var i = 0; i < test.versions.length; i++){
          lang = ";" + test.versions[i].lang
          if(lang == ";EN"){
            title = prompt("Please enter title for imported test:", test.versions[i].title);
          } else {
            title = prompt("Proszę wprowadzić tytuł importowanego testu:", test.versions[i].title);
          }
          title += ";" + test.versions[i].questions.length + "\n"
          for(var j = 0; j < test.versions[i].questions.length; j++){

            question = j + ";" + test.versions[i].questions[j].type + lang + ";" + test.versions[i].questions[j].content
            if (test.versions[i].questions[j].type === "W") {
              // Close question
              answers = test.versions[i].questions[j].answers.split("|")
              ans_res = ";" + answers.length
              for(var z = 0; z < answers.length; z++){
                answers[z] = answers[z].split(';').join('=')
                ans_res += ";" + answers[z]
              }
            } else {
              ans_res = ";" + test.versions[i].questions[j].answers;
            }
            question += ans_res + "\n"
            moreQuestions += question;
          }
          ver_CSV += title + moreQuestions;
          title = ""
          moreQuestions = ""
        }

        const element = document.createElement("a");
        const file = new Blob([ver_CSV], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "csv_export.csv";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();      
			},	
			error: function(err) {
				console.log(err)
				// ??
			}
		})
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
        exportCSV={id => exportCSV(id)}
        refreshTest={() => refreshTest()}
        testsList={testsList}
      />
    );
  }
}
