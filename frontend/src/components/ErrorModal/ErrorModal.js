import React from 'react';
import { Modal, Button } from "react-bootstrap";

const ErrorModal = props => {
    return (
        <Modal show={props.err} onHide={props.click}>
            <Modal.Header closeButton>
                <Modal.Title>Błąd! Status: {props.status}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.msg}</Modal.Body>
            <Modal.Footer>
                <Button size="s" variant="primary" onClick={props.click}>
                    Rozumiem
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ErrorModal;