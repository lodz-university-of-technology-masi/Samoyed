import React from 'react'
import { Col } from 'react-bootstrap'
import './Candidate.css';
const Canditate = (props) => {
    const {id, email, chooseUser} = props;

    return (
        <Col className="candidate__row" onClick={() => chooseUser(id)}>{email}</Col>
    )
}

export default Canditate