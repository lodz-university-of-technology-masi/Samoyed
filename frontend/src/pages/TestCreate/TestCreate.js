import React, { useState, useEffect, Component } from "react";
import Loader from "../../components/UI/Loader/Loader";
import { func } from "prop-types";
import { useHistory } from "react-router";
import apiRequest from "../../ApiRequest";
import { withRouter } from "react-router-dom";

const TestCreate = props => {
  const history = useHistory();
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState({ PL: "", EN: "" });
  const [version, setVersion] = useState("PL");
  const [questions, setQuestions] = useState({ PL: [], EN: [] });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      if (props.edited != undefined) {
        for (var i = 0; i < props.edited.versions.length; i++) {
          setVersion(props.edited.versions[i].lang);
          changeTitleEdit(
            props.edited.versions[i].title,
            props.edited.versions[i].lang
          );

          for (var j = 0; j < props.edited.versions[i].questions.length; j++) {
            if (i == 0) {
              appendQuestion();
              changeType(j, props.edited.versions[i].questions[j].type);
            }
            changeContentEdit(

              j,
              props.edited.versions[i].questions[j].content,
              props.edited.versions[i].lang
            );
            if (props.edited.versions[i].questions[j].type == "W") {
              for (
                var k = 0;
                k < props.edited.versions[i].questions[j].answers.length;
                k++
              ) {
                changeAnswersComplexEdit(
                  j,
                  k,
                  props.edited.versions[i].questions[j].answers[k],
                  props.edited.versions[i].lang
                );
              }
            } else {
              changeAnswersSimpleEdit(
                j,
                props.edited.versions[i].questions[j].answers,
                props.edited.versions[i].lang
              );
            }
          }
        }
      } else {
        setQuestions({ PL: [], EN: [] });
      }
      setLoaded(true);
    }
  });

  // Data handlers //

  // Universal Methods
  function changeVersion(e) {
    setVersion(e.target.value);
  }

  function changeType(n, value) {
    let newQuestions = { ...questions };
    newQuestions["PL"][n].type = value;
    newQuestions["EN"][n].type = value;
    if (value === "W") {
      let q = [
        { value: "", correct: true },
        { value: "", correct: false },
        { value: "", correct: false },
        { value: "", correct: false }
      ];
      newQuestions["PL"][n].answers = [...q];
      newQuestions["EN"][n].answers = [...q];
    } else {
      newQuestions["PL"][n].answers = "";
      newQuestions["EN"][n].answers = "";
    }
    setQuestions(newQuestions);
  }

  function appendQuestion() {
    let newQuestions = { ...questions };
    let q = {
      content: "",
      type: "O",
      answers: ""
    };
    newQuestions["PL"].push({ ...q });
    newQuestions["EN"].push({ ...q });
    setQuestions(newQuestions);
  }

  function deleteQuestion(e) {
    let newQuestions = { ...questions };
    newQuestions["PL"].splice(e.target.name, 1);
    newQuestions["EN"].splice(e.target.name, 1);
    setQuestions(newQuestions);
  }

  // Creation Methods
  function changeTitleCreation(e) {
    let newTitle = { ...title };
    newTitle[version] = e.target.value;
    setTitle(newTitle);
  }

  function changeContentCreation(n, value) {
    let newQuestions = { ...questions };
    newQuestions[version][n].content = value;
    setQuestions(newQuestions);
  }

  function changeAnswersSimpleCreation(n, value) {
    let newQuestions = { ...questions };
    newQuestions[version][n].answers = value;
    setQuestions(newQuestions);
  }
  function changeAnswersComplexCreation(n, m, value) {
    let newQuestions = { ...questions };
    newQuestions[version][n].answers[m].value = value;
    setQuestions(newQuestions);
  }
  function changeAnswersCorrectCreation(n, m, value) {
    let newQuestions = { ...questions };
    newQuestions[version][n].answers[m].correct = value;
    setQuestions(newQuestions);
  }

  // Edit Methods
  function changeTitleEdit(newT, ver) {
    let newTitle = { ...title };
    newTitle[ver] = newT;
    setTitle(newTitle);
  }

  function changeContentEdit(n, value, ver) {
    let newQuestions = { ...questions };
    newQuestions[ver][n].content = value;
    setQuestions(newQuestions);
  }

  function changeAnswersSimpleEdit(n, value, ver) {
    let newQuestions = { ...questions };
    newQuestions[ver][n].answers = value;
    setQuestions(newQuestions);
  }

  function changeAnswersComplexEdit(n, m, value, ver) {
    let newQuestions = { ...questions };
    newQuestions[ver][n].answers[m].value = value;
    setQuestions(newQuestions);
  }

  function changeAnswersCorrectEdit(n, m, value, ver) {
    let newQuestions = { ...questions };
    newQuestions[ver][n].answers[m].correct = value;
    setQuestions(newQuestions);
  }

  // Request Methods

  function send() {
    let test = {
      versions: []
    };
    // Add versions
    for (let v in questions) {
      if (title[v].length > 0) {
        let n = test.versions.length;
        test.versions[n] = {};
        test.versions[n].lang = v;
        test.versions[n].title = title[v];
        test.versions[n].questions = questions[v].map(q => {
          if (q.type === "W") {
            // Format all choice answers into single string
            let answers = q.answers.map(a => {
              return a.value + ";;" + a.correct;
            });
            answers = answers.join("|");
            return { ...q, answers: answers };
          }
          return { ...q };
        });
      }
    }
    setUploading(true);
    apiRequest({
      method: "POST",
      path: "tests",
      body: test,
      success: function(res) {
        // Redirect to /tests
        history.push("/tests");
      },
      error: function(err) {
        console.log(err);
        // ??
      }
    });
    console.log(test);
  }

  // Renders block of modifiable questions
  const questionList = questions[version].map((q, i) => {
    // Depending on question type, this renders different blocks for possible answers
    let answersBlock;
    if (q.type === "W") {
      answersBlock = [];
      for (let m = 0; m < 4; m++) {
        answersBlock.push(
          <>
            <input
              className="form-check-input"
              type="checkbox"
              onChange={e => {
                changeAnswersCorrectCreation(i, m, e.target.checked);
              }}
              checked={q.answers[m].correct}
            />
            <input
              className="form-control mr-2"
              placeholder={"Odpowiedź " + (m + 1)}
              onChange={e => {
                changeAnswersComplexCreation(i, m, e.target.value);
              }}
              value={q.answers[m].value}
            />
          </>
        );
      }
      answersBlock = (
        <div className="form-group form-inline row">{answersBlock}</div>
      );
    } else {
      answersBlock = (
        <div className="form-group row">
          <input
            className="form-control"
            placeholder="Odpowiedzi"
            value={q.answers}
            onChange={e => {
              changeAnswersSimpleCreation(i, e.target.value);
            }}
          />
        </div>
      );
    }
    return (
      <div key={i}>
        <div className="form-inline row" key={i}>
          <input
            className="form-control mr-2 mb-2"
            placeholder="Pytanie"
            value={q.content}
            onChange={e => {
              changeContentCreation(i, e.target.value);
            }}
          />
          <select
            className="form-control mr-2 mb-2"
            value={q.type}
            onChange={e => {
              changeType(i, e.target.value);
            }}
          >
            <option value="W">Wyboru</option>
            <option value="O">Otwarte</option>
            <option value="L">Liczbowe</option>
          </select>
          <button
            className="btn btn-danger mr-2 mb-2"
            onClick={deleteQuestion}
            name={i}
          >
            Usuń
          </button>
        </div>
        {answersBlock}
      </div>
    );
  });

  if (uploading) {
    return (
      <Loader>
        <h3>Trwa zapisywanie...</h3>
      </Loader>
    );
  } else {
    return (
      <>
        <div className="form-inline row mb-2">
          <select
            className="form-control"
            value={version}
            onChange={changeVersion}
          >
            <option value="PL">PL</option>
            <option value="EN">EN</option>
          </select>
          <label className="form-check-label ml-2">Wersja językowa</label>
        </div>
        <div className="form-group row">
          <input
            className="form-control"
            placeholder="Tytuł"
            onChange={changeTitleCreation}
            value={title[version]}
          />
          <small id="passwordHelpBlock" class="form-text text-muted">
            Jeśli pozostawisz to pole puste, wybrana wersja językowa zostanie
            zignorowana.
          </small>
        </div>
        {questionList}
        <div className="form-group row">
          <button
            className="btn btn-primary col-12 mb-2"
            onClick={appendQuestion}
          >
            Dodaj pytanie
          </button>
          <button className="btn btn-primary col-12" onClick={send}>
            Zapisz
          </button>
        </div>
      </>
    );
  }
};

export default withRouter(TestCreate);
