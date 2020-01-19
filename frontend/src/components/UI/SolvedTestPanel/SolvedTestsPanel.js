import React from "react";
import SolvedTest from "./SolvedTest/SolvedTest";
import { useSelector } from "react-redux";
import "./SolvedTestsPanel.css";
import { Button, Row, Col } from "react-bootstrap";
import { withRouter } from "react-router";

const SolvedTestPanel = props => {

  const {
    solvedTestsList,
    refreshTest,
    exportCSV
  } = props;

  const userGroup = useSelector(state => state.data["cognito:groups"][0]);

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th>Tytuł</th>
            <th>Data rozwiązania</th>
            <th>Rozwiązane przez</th>
            <th>Czy oceniony</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {solvedTestsList.map((test, i) => {
            return (
              <SolvedTest
                userGroup={userGroup}
                key={i}
                solvedOn={test.solvedOn}
                solvedBy={test.solvedBy}
                isEvaluated={test.evaluated}
                id={test.id}
                versions={test.versions}
                exportCSV={() => exportCSV(test.id)}
              />
            );
          })}
        </tbody>
      </table>
      <Row>
        <Col md={4}>
          <Button
            block
            variant="outline-primary"
            onClick={e => {
              refreshTest();
            }}
          >
            Odśwież testy
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default withRouter(SolvedTestPanel);
