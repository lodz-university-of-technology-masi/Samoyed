import React, { useState, useEffect } from "react";
import { Modal, Button, Row } from "react-bootstrap";

import Loader from "../Loader/Loader";
import Canditate from "../Candidate/Candidate";

const CandidatePicker = props => {
  const {
    show,
    setShow,
    title,
    users,
    loading,
    testId,
    assignCandidateToTest
  } = props;
  const [picked, setPicked] = useState(false);
  const [id, setId] = useState();

  const chooseUser = id => {
    setPicked(true);
    setId(id);
  };

  const handleClose = () => {
    setShow(false);
    setPicked(false);
    setId(null);
  };

  const saveChanges = () => {
    assignCandidateToTest(id, testId);
    handleClose();
  };

  const renderUsers = () => {
    if (users !== undefined) {
      return users.map(user => {
        let attributes = user.attributes;
        let email = attributes.find(a => {
          return a.name === "email";
        });
        let id = attributes.find(a => {
          return a.name === "sub";
        });
        return (
          <Row>
            <Canditate
              chooseUser={id => chooseUser(id)}
              id={id.value}
              email={email.value}
            />
          </Row>
        );
      });
    }
  };

  return (
    <Modal size="lg" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Udziel dostępu do testu: "{title}" </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h3 className="candidate__header">Lista dostępnych kandydatów:</h3>
        <div>{loading ? <Loader /> : renderUsers()}</div>
      </Modal.Body>
      <Modal.Footer>
        <p className="candidate__text">Id kandydata: {id}</p>
        <Button variant="secondary" onClick={handleClose}>
          Zamknij
        </Button>
        <Button disabled={!picked} variant="primary" onClick={saveChanges}>
          Zapisz zmiany
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CandidatePicker;
