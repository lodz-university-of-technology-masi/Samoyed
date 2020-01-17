import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, DropdownButton, Dropdown, Col, Row } from "react-bootstrap";
import "./Test.css";
import CandidatePicker from "../../CandidatePicker/CandidatePicker";
import apiRequest from "../../../../ApiRequest";
import { LinkContainer } from 'react-router-bootstrap';

const Test = props => {
	const [show, setShow] = useState(false);
	const [users, setUsers] = useState();
	const [loading, setLoading] = useState(true);
	const {
		createdOn,
		id,
		versions,
		deleteTest,
		exportCSV,
		userGroup,
		assignCandidateToTest
	} = props;

	useEffect(() => {
		apiRequest({
			method: "GET",
			path: "fetchAllCandidates",
			success: function (res) {
				setUsers(JSON.parse(res.responseText));
				setLoading(false);
			},
			error: function (err) {
				console.log(err);
			}
		});
	}, []);

	const renderCandidatesButtons = () => {
		return (
			<Link to={"/test/" + id}>
				<button className="btn btn-primary mr-1">Rozwiąż</button>
			</Link>
		);
	};

	const renderRecruitersButtons = () => {
		return (
			<Row>
				<Col style={{ padding: "0" }}>
					<Button
						onClick={() => {
							setShow(true);
						}}
						variant="outline-primary"
					>
						Dodaj kandydata
          </Button>
				</Col>
				<Col style={{ padding: "0" }}>
					<DropdownButton variant="outline-secondary" title={`Opcje`}>
						<Dropdown.Item onClick={() => {
							exportCSV(id);
						}}>Pobierz CSV</Dropdown.Item>
						<LinkContainer to={`/test/edit/${id}`}>
							<Dropdown.Item>
								Edytuj
            			</Dropdown.Item>
						</LinkContainer>

						<Dropdown.Item
							onClick={() => {
								deleteTest(id);
							}}
						>
							Usuń
            </Dropdown.Item>
					</DropdownButton>
				</Col>
				<CandidatePicker
					assignCandidateToTest={(candidateId, testId) =>
						assignCandidateToTest(candidateId, testId)
					}
					loading={loading}
					users={users}
					title={versions[0].title}
					show={show}
					setShow={setShow}
					testId={id}
				/>
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
			<td align="center">{new Date(createdOn).toLocaleDateString()}</td>
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

export default Test;
