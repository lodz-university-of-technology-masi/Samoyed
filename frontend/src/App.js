import React from "react";
import { Link } from "react-router-dom";
import { Navbar, NavItem, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./App.css";
import Routes from './routes/Routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './assets/logo.png';
import { Provider } from 'react-redux';
import store from './redux/store'

function App(props) {
	return (
		<Provider store = {store}>
			<Navbar id="mainNav" bg="light" expand="lg" fluid collapseOnSelect>
				<div className="App container">
				<Navbar.Brand>
					<Link to="/">
						<img alt="Nasze logo" src={logo} className="img-logo"/>
					</Link>
				</Navbar.Brand>
				<Navbar.Toggle />
				<Navbar.Collapse >
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
			<div className="container py-4">
				<Routes />
			</div>
		</Provider>
	);
}

export default App;