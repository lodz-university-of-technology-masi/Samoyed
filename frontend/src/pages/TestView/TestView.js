import React, { useState, useEffect } from "react";
import apiRequest from "../../ApiRequest";
import Loader from "../../components/UI/Loader/Loader";

export default function TestView(props) {
  const [params] = useState({ ...props.match.params });
  const [loaded, setLoaded] = useState(false);
  const [versions, setVersions] = useState([]);
  const [viewVersion, setViewVersion] = useState(-1);
  const [answers, setAnswers] = useState([]);

  // Load question from API
  useEffect(() => {
    apiRequest({
      method: "GET",
      path: "tests/id/" + params.id,
      success: function(res) {
        let test = JSON.parse(res.responseText);
        setVersions(test.versions);
        setViewVersion(0);
        setLoaded(true);
      },
      error: function(err) {
        console.log(err);
        // ??
      }
    });
  }, [params.id]);

  function updateAnswer(e) {
    let newAnswers = [...answers];
    newAnswers[e.target.name] = e.target.value;
    setAnswers(newAnswers);
  }

  function changeVersion(e) {
    setViewVersion(e.target.value);
  }

  function send(e) {
    let lang = "";
    viewVersion === 0 ? (lang = "PL") : (lang = "EN");
    let answerSheet = {
      lang: lang,
      answers: answers
    };
    apiRequest({
      method: "POST",
      path: "tests/solve/" + params.id,
      body: answerSheet,
      success: function(res) {
        console.log(res);
      },
      error: function(err) {
        console.log(err);
        // ??
      }
    });
  }

  // Renders all the divs containing different types of questions
  const questionsView = function() {
    // Render nothing if test not loaded (there is no versions)
    if (viewVersion < 0) return "";
    // Render test otherwise
    let map = versions[viewVersion].questions.map((q, i) => {
      let divs = [];
      // Title
      let heading = (
        <div className="card-header">{i + 1 + ". " + q.content}</div>
      );
      // Questions
      if (q.type === "W") {
        // Close question
        let answers = q.answers.split("|");
        for (let n in answers) {
          divs.push(
            <div className="form-check" key={"answer" + i + "." + n}>
              <label className="form-check-label">
                <input
                  onChange={updateAnswer}
                  className="form-check-input"
                  type="radio"
                  name={i}
                  value={n}
                />
                {answers[n].split(";;")[0]}
              </label>
            </div>
          );
        }
      } else if (q.type === "O") {
        // Open question
        divs.push(
          <input
            onChange={updateAnswer}
            className="form-control form-control-sm"
            name={i}
            placeholder="Odpowiedź"
            key={"answer" + i}
          />
        );
      } else if (q.type === "L") {
        // Number value
        divs.push(
          <input
            onChange={updateAnswer}
            className="form-control form-control-sm"
            type="number"
            name={i}
            placeholder="Odpowiedź"
            key={"answer" + i}
          />
        );
      }
      return (
        <div className="card mb-3" key={"question" + i}>
          {heading}
          <div className="card-body">{divs}</div>
        </div>
      );
    });
    return map;
  };

  return loaded ? (
    <>
      {viewVersion >= 0 ? (
        <div className="form-inline">
          <select className="form-control" onChange={changeVersion}>
            {versions.map((v, i) => {
              return (
                <option key={i} value={i}>
                  {v.lang}
                </option>
              );
            })}
          </select>
          <h1 className="ml-3">{versions[viewVersion].title}</h1>
        </div>
      ) : (
        ""
      )}
      {questionsView()}
      <button className="btn btn-primary col-12" onClick={send}>
        Zapisz i zakończ test
      </button>
    </>
  ) : (
    <Loader>
      <h1>Ładowanie...</h1>
    </Loader>
  );
}
