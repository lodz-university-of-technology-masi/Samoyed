import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import classes from "./Profile.module.css";

export default function Profile() {
  const state = useSelector(state => state);
  const roleName = state.data["cognito:groups"].includes("recruiters")
    ? "Rekruter"
    : "Kandydat";
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [gender, setGender] = useState("");

  const givenNameChanged = (e) => {
    let newGivenName = {...state.given_name};
    newGivenName = e.target.value;
    setGivenName(newGivenName);
  }

  const familyNameChanged = (e) => {
    let newFamilyName = {...state.family_name};
    newFamilyName = e.target.value;
    setFamilyName(newFamilyName);
  }

  const genderChanged = (e) => {
    let newGender = {...gender};
    newGender = e.target.value;
    setGender(newGender);
  }

  const updateProfile = () => {
    // TBC...
  }

  return (
    <Container className={classes.profile}>
      <Row>
        <Col lg="12">
          <h2>Dane profilu:</h2>
          <hr className={classes.profile__line} />
        </Col>
        <Col className={classes.profile__info} lg={6}>
              <h3>Imię:</h3>
              <p>{state.data.given_name}</p>
              <h3>Płeć</h3>
              <p>{state.data.gender === 'M' ? "Mężczyzna" : "Kobieta"}</p>
              <h3>Rola</h3>
              <p>{roleName}</p>
          </Col>
          <Col className={classes.profile__info} lg={6}>
              <h3>Nazwisko</h3>
              <p >{state.data.family_name }</p>
              <h3>Adres Email:</h3>
              <p>{state.data.email}</p>
          </Col>
      </Row>
      <Row>
        <Col>
          <h2>Edycja profilu:</h2>
          <hr className={classes.profile__line} />
        </Col>
      </Row>
      <Row>
        <Col>
          <input placeholder="Imię" type="text" onChange={(e) => givenNameChanged(e)} value={givenName} />
        </Col>
        <Col>
          <input placeholder="Nazwisko" type="text" onChange={(e) => familyNameChanged(e)} value={familyName} />
        </Col>
        <Col>
          <h4>Płeć</h4>
          <select placeholder="Płeć" onChange={(e) => genderChanged(e)} value={gender}>
            <option value="K">Kobieta</option>
            <option value="M">Mężczyzna</option>
          </select>
        </Col>
      </Row>
      <Row>
        <button className="btn btn-primary col-12" onClick={updateProfile}>
          Zatwierdź
        </button>
      </Row>
      <pre>{JSON.stringify(state, null, "    ")}</pre>
    </Container>
  );
}
