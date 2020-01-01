import React from "react";
import { Link } from "react-router-dom";
import { Navbar, NavItem, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../../assets/logo.png";

const NavMenu = props => {
  return (
    <>
      <Navbar id="mainNav" bg="light" expand="lg" fluid collapseOnSelect>
        <div className="App container">
          <Navbar.Brand>
            <Link to="/">
              <img alt="Nasze logo" src={logo} className="img-logo" />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ml-auto" pullRight>
              <LinkContainer to="/login">
                <NavItem>Zaloguj się</NavItem>
              </LinkContainer>
              <LinkContainer to="/tests">
                <NavItem>Testy</NavItem>
              </LinkContainer>
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
