import React, { useState } from "react";
import { Link } from "react-router-dom";
import Test from "./Test/Test";
import { useSelector } from "react-redux";
import "./TestsPanel.css";
import { Modal, Button, Row, Col } from "react-bootstrap";
import apiRequest from "../../../ApiRequest";
import Loader from "../Loader/Loader";

const TestPanel = props => {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [user, setUser] = useState({
    login: "",
    password: ""
  });

  function signIn(e) {
    setIsLoading(true);
    apiRequest({
      method: "POST",
      path: `user/signup`,
      body: {
        email: user.login,
        password: user.password
      },
      success: function(res) {
        handleClose();
        setIsLoading(false);
      },
      error: function(err) {
        console.log(err);
      }
    });
    e.preventDefault();
  }

  const {
    testsList,
    deleteTest,
    refreshTest,
    exportCSV,
    assignCandidateToTest
  } = props;

  const userGroup = useSelector(state => state.data["cognito:groups"][0]);

  function handleChange(e) {
    let newUser = { ...user };
    newUser[e.target.name] = e.target.value;
    setUser(newUser);
  }

  const renderModal = () => {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Utwórz konto kandydata</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <Loader/>
          ) : (
            <>
              <Row>
                <Col className="d-flex justify-content-center">
                  <input
                    type="text"
                    id="login"
                    className="fadeIn second"
                    name="login"
                    placeholder="Login"
                    value={user.login}
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <Row>
                <Col className="d-flex justify-content-center">
                  <input
                    type="password"
                    id="password"
                    className="fadeIn third"
                    name="password"
                    placeholder="Hasło"
                    value={user.password}
                    onChange={handleChange}
                  />
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Zamknij
          </Button>
          <Button variant="outline-primary" onClick={signIn}>
            Utwórz konto
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <>
      {renderModal()}
      <table className="table">
        <thead>
          <tr>
            <th>Tytuł</th>
            <th>Ostatnia modyfikacja:</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {testsList.map((test, i) => {
            return (
              <Test
                assignCandidateToTest={(candidateId, testId) =>
                  assignCandidateToTest(candidateId, testId)
                }
                userGroup={userGroup}
                key={i}
                createdOn={test.createdOn}
                id={test.id}
                versions={test.versions}
                assignments={test.assignments}
                deleteTest={() => deleteTest(test.id)}
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
        <Col md={4}>
          <Link className="w-100" to="/test/create">
            {userGroup === "recruiters" && (
              <Button className="w-100" block variant="outline-primary">
                Dodaj nowy test
              </Button>
            )}
          </Link>
        </Col>
        <Col md={4}>
          {userGroup === "recruiters" && (
            <Button onClick={() => handleShow()} block variant="outline-dark">
              Utwórz konto kandydata
            </Button>
          )}
        </Col>
      </Row>
    </>
  );
};

export default TestPanel;
