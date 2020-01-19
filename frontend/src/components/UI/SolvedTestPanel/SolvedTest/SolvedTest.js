import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DropdownButton, Dropdown, Col, Row } from "react-bootstrap";
import "./SolvedTest.css";
import { LinkContainer } from 'react-router-bootstrap';
import apiRequest from "../../../../ApiRequest";

const SolvedTest = props => {
	const [users, setUsers] = useState();
	const {
		solvedOn,
		solvedBy,
		id,
		versions,
		isEvaluated,
		userGroup,
	} = props;

	useEffect(() => {
		apiRequest({
			method: "GET",
			path: "fetchAllCandidates",
			success: function (res) {
				setUsers(JSON.parse(res.responseText));
			},
			error: function (err) {
				console.log(err);
			}
		});
	}, []);

	const getUser = (userId) => {
		if (users !== undefined) {
			return users.map(user => {
			  let attributes = user.attributes;
			  let email = attributes.find(a => {
				return a.name === "email";
			  });
			  let id = attributes.find(a => {
				return a.name === "sub";
			  });
			  if (id.value === userId) {
				return email.value;
			  } else return null;
			});
		  }
	}

	const renderCandidatesButtons = () => {
		return (
			<Link to={`/solvedtests/${id}`}>
				<button className="btn btn-primary mr-1">Obejrzyj</button>
			</Link>
		);
	};

	const renderRecruitersButtons = () => {
		return (
			<Row>
				<Col style={{ padding: "0" }}>
					<Link to={`/evaluate/${id}`}>
						<button className="btn btn-primary mr-1">Oceń</button>
					</Link>
				</Col>
			</Row>
		);
	};

	return (
		<tr>
			<td>
				{versions.map((v, j) => {
					return <div key={j}>{v.title}</div>;
				})}
			</td>
			<td align="center">{new Date(solvedOn).toLocaleDateString()}</td>
			<td align="center">{getUser(solvedBy)}</td>
			<td align="center">{isEvaluated ? "✔️" : "❌"}</td>
			<td width="26%" align="center">
				<div className="table__content">
					{userGroup === "recruiters"
						? renderRecruitersButtons()
						: renderCandidatesButtons()}
				</div>
			</td>
			
		</tr>
	);
};

export default SolvedTest;
