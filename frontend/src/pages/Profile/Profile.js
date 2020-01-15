import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, FormControl, Form } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import classes from "./Profile.module.css";
import apiRequest from "../../ApiRequest";
import { userUpdate } from "../../redux/actions/userUpdate";

function Profile() {
  const state = useSelector(state => state);
  const roleName = state.data["cognito:groups"].includes("recruiters")
    ? "Rekruter"
    : "Kandydat";
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [gender, setGender] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    setGender(state.data.gender);
    setFamilyName(state.data.family_name);
    setGivenName(state.data.given_name);
  }, [state.data.gender]);

  const givenNameChanged = e => {
    let newGivenName = { ...state.given_name };
    newGivenName = e.target.value;
    setGivenName(newGivenName);
  };

  const familyNameChanged = e => {
    let newFamilyName = { ...state.family_name };
    newFamilyName = e.target.value;
    setFamilyName(newFamilyName);
  };

  const genderChanged = e => {
    let newGender = { ...gender };
    newGender = e.target.value;
    setGender(newGender);
  };

  const updateProfile = () => {
    let profileData = {
      given_name: "",
      family_name: "",
      gender: "",
      email: ""
    };
    profileData.given_name = givenName;
    profileData.family_name = familyName;
    profileData.gender = gender;
    profileData.email = state.data.email;
    apiRequest({
      method: "PUT",
      path: `updateProfile`,
      body: profileData,
      success: function(res) {
      },
      error: function(err) {
        console.log(err);
      }
    });
    dispatch(userUpdate(profileData));
    console.log(profileData);
  };

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
          <p>{state.data.gender === "M" ? "Mężczyzna" : "Kobieta"}</p>
          <h3>Rola</h3>
          <p>{roleName}</p>
        </Col>
        <Col className={classes.profile__info} lg={6}>
          <h3>Nazwisko</h3>
          <p>{state.data.family_name}</p>
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
          <input
            placeholder="Imię"
            type="text"
            onChange={e => givenNameChanged(e)}
            value={givenName}
          />
        </Col>
        <Col>
          <input
            placeholder="Nazwisko"
            type="text"
            onChange={e => familyNameChanged(e)}
            value={familyName}
          />
        </Col>
        <Col>
          <Form.Label className="w-100 text-center">Płeć</Form.Label>
          <Form.Control
            placeholder="Płeć"
            onChange={e => genderChanged(e)}
            value={gender}
            as="select"
          >
            <option value="K">Kobieta</option>
            <option value="M">Mężczyzna</option>
          </Form.Control>
        </Col>
      </Row>
      <Row>
        <Col className="p-2 d-flex justify-content-end">
          <button className="btn btn-primary" onClick={updateProfile}>
            Zatwierdź
          </button>
        </Col>
      </Row>
    </Container>
  );
}

export default withRouter(Profile);
