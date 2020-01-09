import React, { useState } from "react";
import { Modal, Button, Col, Row } from "react-bootstrap";
import './CandidatePicker.css';

const CandidatePicker = props => {
  const { show, setShow, title } = props;
  const [ picked, setPicked ] = useState(false);

  const users = [
    { id: "1", name: "Michał", surname: "Kidawa" },
    { id: "2", name: "Ola", surname: "Wnuk" },
    { id: "3", name: "Krzysztof", surname: "Stępień" }
  ];

  const chooseUser = () => {
      setPicked(true);
  };

  const handleClose = () => {
    setShow(false);
    setPicked(false);
  };

  const renderUsers = () => {
    return users.map(user => {
      return (
        <Row onClick={() => chooseUser()} className="candidate__row">
          <Col lg={4}>{user.id}</Col>
          <Col lg={4}>{user.name}</Col>
          <Col lg={4}>{user.surname}</Col>
        </Row>
      );
    });
  };

  return (

    <Modal size="lg" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Udziel dostępu do testu: "{title}" </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h3 className="candidate__header">Lista dostępnych kandydatów:</h3>
        <div>{renderUsers()}</div>
      </Modal.Body>
      <Modal.Footer>
        <p className="candidate__text">Kandydat: </p>
        <Button variant="secondary" onClick={handleClose}>
          Zamknij
        </Button>
        <Button disabled={!picked} variant="primary" onClick={handleClose}>
          Zapisz zmiany
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CandidatePicker;
