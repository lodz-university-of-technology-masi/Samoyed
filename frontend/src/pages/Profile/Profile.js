import React from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import classes from "./Profile.module.css";

export default function Profile() {
  const state = useSelector(state => state);
  const roleName = state.data["cognito:groups"].includes("recruiters")
    ? "Rekruter"
    : "Kandydat";

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
      <pre>{JSON.stringify(state, null, "    ")}</pre>
    </Container>
  );
}
