import React, { useState, useEffect } from "react";
import CSVReader from "react-csv-reader";
import Loader from "../../components/UI/Loader/Loader";
import { useHistory, useParams } from "react-router";
import apiRequest from "../../ApiRequest";
import { withRouter } from "react-router-dom";
import ErrorModal from "../../components/ErrorModal/ErrorModal";
import Questions from "../../components/Questions/Questions";
import translate from "../../Languages/Translator";
import { Button, Row, Col } from "react-bootstrap";
import monitorSynonyms from "../../Languages/Synonyms";
import "./TestCreate.css";

const TestCreate = props => {
  const history = useHistory();
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState({ PL: "", EN: "" });
  const [version, setVersion] = useState("PL");
  const [questions, setQuestions] = useState({ PL: [], EN: [] });
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [errorData, setErrorData] = useState({ msg: "", status: "" });
  const params = useParams();
  const [isValid, setIsValid] = useState(false);
  const [isTranslatable, setIsTranslatable] = useState(false);
  const [synonym, setSynonym] = useState("");

  const checkValidity = () => {
    let validity = true;
    let translatable = false;
    let modTitle = { ...title };
    if (
      (!modTitle["PL"] || 0 === modTitle["PL"].length) &&
      (!modTitle["EN"] || 0 === modTitle["EN"].length)
    ) {
      validity = false;
    } else if (
      (!modTitle["PL"] || 0 === modTitle["PL"].length) &&
      !(!modTitle["EN"] || 0 === modTitle["EN"].length)
    ) {
      validity = checkQuestionsValidity("EN");
    } else if (
      !(!modTitle["PL"] || 0 === modTitle["PL"].length) &&
      (!modTitle["EN"] || 0 === modTitle["EN"].length)
    ) {
      validity = checkQuestionsValidity("PL");
    } else {
      validity = checkQuestionsValidity("PL") && checkQuestionsValidity("EN");
    }
    if (
      version === "PL" &&
      modTitle["PL"] !== "" &&
      checkQuestionsValidity("PL")
    ) {
      translatable = true;
    } else if (
      version === "EN" &&
      modTitle["EN"] !== "" &&
      checkQuestionsValidity("EN")
    ) {
      translatable = true;
    }

    setIsTranslatable(translatable);
    setIsValid(validity);
  };

  const checkQuestionsValidity = lang => {
    let validity = true;
    for (let i in questions[lang]) {
      if (
        questions[lang][i].content === "" ||
        questions[lang][i].content === " "
      ) {
        validity = false;
      }
      if (questions[lang][i].type === "W") {
        questions[lang][i].answers.forEach((a, j) => {
          if (
            questions[lang][i].answers[j].value === "" ||
            questions[lang][i].answers[j].value === " "
          )
            validity = false;
        });
      } else if (
        questions[lang][i].answers === "" ||
        questions[lang][i].answers === " "
      ) {
        validity = false;
      }
    }
    return validity;
  };

  useEffect(() => {
    if (!loaded) {
      if (props.edited !== undefined) {
        for (var i = 0; i < props.edited.versions.length; i++) {
          setVersion(props.edited.versions[i].lang);
          changeTitleEdit(
            props.edited.versions[i].title,
            props.edited.versions[i].lang
          );

          for (var j = 0; j < props.edited.versions[i].questions.length; j++) {
            if (i === 0) {
              appendQuestion();
              changeType(j, props.edited.versions[i].questions[j].type);
            }
            changeContentEdit(
              j,
              props.edited.versions[i].questions[j].content,
              props.edited.versions[i].lang
            );
            if (props.edited.versions[i].questions[j].type === "W") {
              for (
                var k = 0;
                k < props.edited.versions[i].questions[j].answers.length;
                k++
              ) {
                let answer = props.edited.versions[i].questions[j].answers[
                  k
                ].split(";;");
                changeAnswersComplexEdit(
                  j,
                  k,
                  answer[0],
                  props.edited.versions[i].lang
                );
                if (answer[1] === "true") {
                  changeAnswersCorrectEdit(
                    j,
                    k,
                    answer[0],
                    props.edited.versions[i].lang
                  );
                }
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
        checkValidity();
      } else {
        setQuestions({ PL: [], EN: [] });
        checkValidity();
      }
      setLoaded(true);
    }
  },[]);



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
        { value: "", correct: false },
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
    checkValidity();
  }

  function deleteQuestion(e) {
    let newQuestions = { ...questions };
    newQuestions["PL"].splice(e.target.name, 1);
    newQuestions["EN"].splice(e.target.name, 1);
    setQuestions(newQuestions);
    checkValidity();
  }

  // Creation Methods
  function changeTitleCreation(e) {
    let newTitle = { ...title };
    newTitle[version] = e.target.value;
    setTitle(newTitle);
    checkValidity();
  }

  function changeContentCreation(n, value) {
    let newQuestions = { ...questions };
    newQuestions[version][n].content = value;
    setQuestions(newQuestions);
    checkValidity();
  }

  function changeAnswersSimpleCreation(n, value) {
    let newQuestions = { ...questions };
    newQuestions[version][n].answers = value;
    setQuestions(newQuestions);
    checkValidity();
  }
  function changeAnswersComplexCreation(n, m, value) {
    let newQuestions = { ...questions };
    newQuestions[version][n].answers[m].value = value;
    setQuestions(newQuestions);
    checkValidity();
  }
  function changeAnswersCorrectCreation(n, m, value) {
    let newQuestions = { ...questions };
    newQuestions[version][n].answers[m].correct = value;
    setQuestions(newQuestions);
    checkValidity();
  }

  // Edit Methods
  function changeTitleEdit(newT, ver) {
    let newTitle = title;
    newTitle[ver] = newT;
    setTitle(newTitle);
    checkValidity();
  }

  function changeContentEdit(n, value, ver) {
    let newQuestions = { ...questions };
    newQuestions[ver][n].content = value;
    setQuestions(newQuestions);
    checkValidity();
  }

  function changeAnswersSimpleEdit(n, value, ver) {
    let newQuestions = { ...questions };
    newQuestions[ver][n].answers = value;
    setQuestions(newQuestions);
    checkValidity();
  }

  function changeAnswersComplexEdit(n, m, value, ver) {
    let newQuestions = { ...questions };
    newQuestions[ver][n].answers[m].value = value;
    setQuestions(newQuestions);
    checkValidity();
  }

  function changeAnswersCorrectEdit(n, m, value, ver) {
    let newQuestions = { ...questions };
    newQuestions[ver][n].answers[m].correct = value;
    setQuestions(newQuestions);
    checkValidity();
  }

  // Request Methods

  function send() {
    let test = {
      versions: []
    };

    let proper = true;
    // Add versions
    for (let v in questions) {
      if (title[v].length > 0) {
        let n = test.versions.length;
        test.versions[n] = {};
        test.versions[n].lang = v;
        test.versions[n].title = title[v];
        test.versions[n].questions = questions[v].map(q => {
          if (q.content === "") {
            proper = false;
            return false;
          }
          if (q.type === "W") {
            // Format all choice answers into single string
            let answers = q.answers.map(a => {
              if (a.value === "") {
                proper = false;
                return false;
              }

              return a.value + ";;" + a.correct;
            });
            answers = answers.join("|");
            return { ...q, answers: answers };
          }
          return { ...q };
        });
      }
    }

    if (!proper) {
      window.alert("Uzupełnij wszystkie pola.");
      return;
    }

    setUploading(true);
    if (props.edited === undefined) {
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
          setError(true);
          setErrorData({
            msg: JSON.parse(err.response).error,
            status: err.status
          });
        }
      });
    } else {
      apiRequest({
        method: "PUT",
        path: `tests/id/${params.id}`,
        body: test,
        success: function(res) {
          // Redirect to /tests
          history.push("/tests");
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

  const handleClose = () => {
    setError(false);
    setUploading(false);
  };

  const handleMouseUp = e => {
    let val = e.target.value;
    const selectedVal = val.substring(
      e.target.selectionStart,
      e.target.selectionEnd
    );
    setSynonym(monitorSynonyms(selectedVal, version.toLowerCase()));
  };

  const renderSynonyms = () => {
    let synonyms = [];
    if (synonym.length < 2) {
      synonyms.push(<p className="m-0 synonyms__paragraph">{synonym}</p>);
    } else {
      synonym.forEach((s, i) => {
        synonyms.push(
          <p key={i} className="m-0 synonyms__paragraph">
            {i + 1}. {s}
          </p>
        );
      });
    }
    return synonyms;
  };

  const translateTest = ver => {
    let desiredVersion;
    ver === "PL" ? (desiredVersion = "EN") : (desiredVersion = "PL");
    let newTitle;
    if (desiredVersion === "EN") {
      newTitle = {
        ...title,
        EN: translate(title[ver], desiredVersion.toLowerCase())
      };
    } else {
      newTitle = {
        ...title,
        PL: translate(title[ver], desiredVersion.toLowerCase())
      };
    }
    setTitle(newTitle);
    let translatedQuestions = { ...questions };
    for (let q in translatedQuestions[ver]) {
      let translatedAnswers = [];
      if (translatedQuestions[ver][q].type === "W") {
        translatedQuestions[ver][q].answers.forEach((a, i) => {
          const value = translate(
            translatedQuestions[ver][q].answers[i].value,
            desiredVersion.toLowerCase()
          );
          return translatedAnswers.push({
            ...a,
            value
          });
        });
      } else {
        translatedAnswers = translate(
          translatedQuestions[ver][q].answers,
          desiredVersion.toLowerCase()
        );
      }
      let t = {
        ...translatedQuestions[ver][q],
        content: translate(
          translatedQuestions[ver][q].content,
          desiredVersion.toLowerCase()
        ),
        answers: translatedAnswers
      };
      translatedQuestions[desiredVersion][q] = t;
    }
    setQuestions(translatedQuestions);
  };

  function readCSVFile(csvContent) {
    let lang_num = csvContent[0][0];
    let lang, q_type;
    csvContent.shift();
    let question_num = csvContent[0][1] * 1; //Amount of questions in different languages is always the same

    for (var i = 0; i < lang_num; i++) {
      lang = csvContent[i * (question_num + 1)][2];
      setVersion(lang);
      changeTitleEdit(csvContent[i * (question_num + 1)][0], lang);
      for (var j = 0; j < question_num; j++) {
        q_type = csvContent[i * (question_num + 1) + j + 1][1];
        if (i === 0) {
          appendQuestion();
          changeType(j, q_type);
        }
        changeContentEdit(
          j,
          csvContent[i * (question_num + 1) + j + 1][2],
          lang
        );
        if (q_type === "W") {
          for (
            var k = 0;
            k < csvContent[i * (question_num + 1) + j + 1][3];
            k++
          ) {
            let answer = csvContent[i * (question_num + 1) + j + 1][
              4 + k
            ].split("==");

            changeAnswersComplexEdit(j, k, answer[0], lang);
            if (answer[1] === "true") {
              changeAnswersCorrectEdit(j, k, answer[0], lang);
            }
          }
        } else {
          changeAnswersSimpleEdit(
            j,
            csvContent[i * (question_num + 1) + j + 1][3],
            lang
          );
        }
      }
    }
  }

  if (uploading && !error) {
    return (
      <Loader>
        <h3>Trwa zapisywanie...</h3>
      </Loader>
    );
  } else if (uploading && error) {
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
          <Button
            disabled={!isTranslatable}
            onClick={() => translateTest(version)}
            className="ml-auto"
          >
            Przetłumacz na {version === "PL" ? "EN" : "PL"}
          </Button>
        </div>
        <div className="form-group row">
          <input
            onMouseUp={e => handleMouseUp(e)}
            className="form-control"
            placeholder="Tytuł"
            onChange={e => changeTitleCreation(e)}
            value={title[version]}
          />
          <small id="passwordHelpBlock" className="form-text text-muted">
            Jeśli pozostawisz to pole puste, wybrana wersja językowa zostanie
            zignorowana.
          </small>
        </div>
        <Questions
          handleMouseUp={e => handleMouseUp(e)}
          questions={questions[version]}
          changeAnswersCorrectCreation={changeAnswersCorrectCreation}
          changeAnswersComplexCreation={changeAnswersComplexCreation}
          changeAnswersSimpleCreation={changeAnswersSimpleCreation}
          changeContentCreation={changeContentCreation}
          changeType={changeType}
          deleteQuestion={deleteQuestion}
        />
        <Row className="p-0 synonyms__row">
          <Col>
            {synonym.length > 0 ? (
              <>
                <h4 className="synonyms__header">Proponowane synonimy:</h4>
                {renderSynonyms()}
              </>
            ) : (
              <h4 className="synonyms__header">
                Zaznacz tekst, aby wyświetlić synonimy w języku {version}
              </h4>
            )}
          </Col>
        </Row>
        <div className="form-group row">
          <button
            className="btn btn-primary col-12 mb-2"
            onClick={appendQuestion}
          >
            Dodaj pytanie
          </button>
          <button
            as="input"
            type="submit"
            disabled={!isValid}
            className="btn btn-primary col-12"
            onClick={send}
          >
            {isValid ? "Zapisz" : "Nie można wysłać niekompletnego formularza"}
          </button>
        </div>

        <div>
          <CSVReader
            label="Importuj CSV"
            cssClass="form-group"
            cssInputClass="form-control-file"
            onFileLoaded={csvContent => readCSVFile(csvContent)}
          />
        </div>
      </>
    );
  }
};

export default withRouter(TestCreate);
