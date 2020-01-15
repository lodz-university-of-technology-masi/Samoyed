import React, { useState, useEffect } from "react";
import { Modal, Button, Col, Row } from "react-bootstrap";
import './CandidatePicker.css';
import apiRequest from "../../../ApiRequest";


const CandidatePicker = props => {
  const { show, setShow, title } = props;
  const [ picked, setPicked ] = useState(false);
  const [ users, setUsers ] =  useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiRequest({
      method: "GET",
      path: "fetchAllCandidates",
      success: function(res) {
        setUsers(JSON.parse(res.responseText))
      },
      error: function(err) {
        console.log(err);
      }
    });
  }, []);

  const chooseUser = () => {
      setPicked(true);
  };

  const handleClose = () => {
    setShow(false);
    setPicked(false);
  };

  const renderUsers = () => {
    if(users !== undefined){
      return users.map(user => {
      let attributes = user.attributes;  
      let email = (attributes.find(a => {
        return a.name === "email";
      }))
      let id = (attributes.find(a => {
        return a.name === "sub";
      }))
      return <p>{email.value}{id.value}</p>
      })
    }
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
