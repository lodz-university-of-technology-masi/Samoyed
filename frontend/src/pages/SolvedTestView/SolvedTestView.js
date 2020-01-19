import React, { useEffect, useState, useMemo } from "react";
import { withRouter } from "react-router";
import apiRequest from "../../ApiRequest";
import { Row, Col } from "react-bootstrap";
import "./SolvedTestView.css";

const SolvedTestView = props => {
  const [params] = useState({ ...props.match.params });
  const [recruiterAnswers, setRecruiterAnswers] = useState();
  const [isEvaluated, setIsEvaluated] = useState();
  const [title, setTitle] = useState();

  useEffect(() => {
    apiRequest({
        method: "GET",
        path: "/SolvedTestGetById/id/" + params.id,
        success: function(res) {
          setRecruiterAnswers(JSON.parse(res.response).versions[0]);
          setIsEvaluated(JSON.parse(res.response).evaluated);
          setTitle(JSON.parse(res.response).versions[0].title);
        },
        error: function(err) {
          console.log(err);
          // ??
        }
      });
  }, [params.id]);

  const renderRecruiterAnswers = () => {
    if (recruiterAnswers !== undefined) {
      let map = recruiterAnswers.questions.map((q, i) => {
        let divs = [];
        let heading = (
          <div className="card-header">{i + 1 + ". " + q.content}</div>
        );
        divs.push(
          <div key={i}>
            <Row
              style={{ fontSize: "1.2em", fontWeight: "bold" }}
              className="m-2"
            >
              Odpowiedź:{" "}
            </Row>
            <Row style={{ fontSize: "1.0em" }} className="m-2">
              {q.answers}
            </Row>
          </div>
        );
        return (
          <div className="card mb-3" key={"question" + i}>
            {heading}
            <div
              className="card-body"
              style={
                recruiterAnswers.evaluations[i] === true
                  ? { backgroundColor: "rgba(66, 206, 85, 0.596)" }
                  : { backgroundColor: "rgba(231, 71, 71, 0.596)" }
              }
            >
              {divs}
            </div>
          </div>
        );
      });
      return (
        <>
          <div>{map}</div>
          <Row>
            <Col>
              <div>
                <h3 className="point__header">Uzyskane punkty: </h3>
                <p className="points">
                  {countPoints} / {maxPoints}
                </p>
              </div>
            </Col>
          </Row>
        </>
      );
    }
  };

  const countPoints = useMemo(() => {
    let points = 0;
    if (recruiterAnswers !== undefined && isEvaluated === true) {
      let answers = { ...recruiterAnswers };
      answers.evaluations.forEach(q => {
        if (q === true) {
          points += 1;
        }
      });
    }
    return points;
  }, [recruiterAnswers, isEvaluated]);

  const maxPoints = useMemo(() => {
    if (recruiterAnswers !== undefined) {
      return recruiterAnswers.questions.length;
    }
  }, [recruiterAnswers]);

  const renderUserAnswers = () => {
    if (recruiterAnswers !== undefined) {
      let map = recruiterAnswers.questions.map((q, i) => {
        let divs = [];
        let heading = (
          <div className="card-header">{i + 1 + ". " + q.content}</div>
        );
        divs.push(
          <div key={i}>
            <Row
              style={{ fontSize: "1.2em", fontWeight: "bold" }}
              className="m-2"
            >
              Twoja odpowiedź:{" "}
            </Row>
            <Row style={{ fontSize: "1.0em" }} className="m-2">
              {q.answers}
            </Row>
          </div>
        );
        return (
          <div className="card mb-3" key={"question" + i}>
            {heading}
            <div className="card-body">{divs}</div>
          </div>
        );
      });
      return (
        <>
          <div>{map}</div>
          <Row>
            <Col>
              <div>
                <h3 className="point__header">
                  Punkty pojawią się po weryfikacji przez rekrutera
                </h3>
              </div>
            </Col>
          </Row>
        </>
      );
    }
  };

  return (
    <>
      <Row className="pl-3">
        <h1>{title}</h1>
      </Row>
      <Row className="pl-3 mb-4">
        {isEvaluated === true
          ? "Sprawdzone przez rerkutera: ✔️"
          : "Sprawdzone przez rerkutera: ❌"}
      </Row>
      {isEvaluated === true ? renderRecruiterAnswers() : renderUserAnswers()}
    </>
  );
};

export default withRouter(SolvedTestView);
