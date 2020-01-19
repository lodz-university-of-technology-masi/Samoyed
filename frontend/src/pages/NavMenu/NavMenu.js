import React from "react";
import { Link } from "react-router-dom";
import { Navbar, NavItem, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../../assets/logo.png";
import { useSelector } from "react-redux";

const NavMenu = props => {
  const state = useSelector(state => state);

  let authLinks = (
    <LinkContainer to="/login">
      <NavItem>Zaloguj się</NavItem>
    </LinkContainer>
  );

  if (state.isLogged) {
    authLinks = (
      <>
        <LinkContainer to="/tests">
          <NavItem>Testy</NavItem>
        </LinkContainer>
        <LinkContainer to="/solvedtests">
          <NavItem>Rozwiązane testy</NavItem>
        </LinkContainer>
        <LinkContainer to="/profile">
          <NavItem>Profil</NavItem>
        </LinkContainer>
        <LinkContainer to="/logout">
          <NavItem>Wyloguj się</NavItem>
        </LinkContainer>
      </>
    );
  }

  return (
    <>
      <Navbar id="mainNav" bg="light" expand="lg" collapseOnSelect>
        <div className="App container">
          <Navbar.Brand>
            <Link to="/">
              <img alt="Nasze logo" src={logo} className="img-logo" />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ml-auto">
              {authLinks}
              <LinkContainer to="/team">
                <NavItem>Zespół</NavItem>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
    </>
  );
};

export default NavMenu;
