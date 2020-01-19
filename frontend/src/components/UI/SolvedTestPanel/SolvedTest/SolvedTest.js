import React from "react";
import { Link } from "react-router-dom";
import { DropdownButton, Dropdown, Col, Row } from "react-bootstrap";
import "./SolvedTest.css";
import { LinkContainer } from 'react-router-bootstrap';

const SolvedTest = props => {
	const {
		solvedOn,
		solvedBy,
		id,
		versions,
		exportCSV,
		userGroup,
	} = props;

	const renderCandidatesButtons = () => {
		return (
			<Link>
				<button className="btn btn-primary mr-1">Obejrzyj</button>
			</Link>
		);
	};

	const renderRecruitersButtons = () => {
		return (
			<Row>
				<Col style={{ padding: "0" }}>
					<DropdownButton variant="outline-secondary" title={`Opcje`}>
						<Dropdown.Item onClick={() => {
							exportCSV(id);
						}}>
							Pobierz CSV
						</Dropdown.Item>
						<LinkContainer to={`/evaluate/${id}`}>
							<Dropdown.Item>
								Oceń
            				</Dropdown.Item>
						</LinkContainer>
					</DropdownButton>
				</Col>
			</Row>
		);
	};

	return (
		<tr>
			<td>
				{versions.map((v, j) => {
					return <div key={j}>{"[" + v.lang + "] " + v.title}</div>;
				})}
			</td>
			<td align="center">{new Date(solvedOn).toLocaleDateString()}</td>
			<td align="center">{solvedBy}</td>
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
