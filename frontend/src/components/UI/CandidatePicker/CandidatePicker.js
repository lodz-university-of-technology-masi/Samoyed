import React from "react";
import { Modal, Button, Col, Row } from "react-bootstrap";

const CandidatePicker = props => {
  const { show, setShow, title } = props;

  const users = [
    { id: "1", name: "Michał", surname: "Kidawa" },
    { id: "2", name: "Ola", surname: "Wnuk" },
    { id: "3", name: "Krzysztof", surname: "Stępień" }
  ];

  const chooseUser = () => {};

  const handleClose = () => {
    setShow(false);
  };

  const renderUsers = () => {
    return users.map(user => {
      return (
        <Row>
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
        <h3>Lista kandydatów:</h3>
        <div>{renderUsers()}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Zamknij
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Zapisz zmiany
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CandidatePicker;
