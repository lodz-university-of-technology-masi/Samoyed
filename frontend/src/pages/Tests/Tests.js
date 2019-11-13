import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Tests.css";

export default function Tests()
{
	const [testsList, setTestsList] = useState([])

	useEffect(() => {
		var xmlHttp = new XMLHttpRequest()
		xmlHttp.open("GET", "https://8mx18wwru3.execute-api.us-east-1.amazonaws.com/dev/tests", false)
		xmlHttp.setRequestHeader("Accept", "application/json")
		xmlHttp.send(null)
		setTestsList(JSON.parse(xmlHttp.responseText))
	}, [])

	return (
		<div className="Team">
			<div className="lander">
				<h1>Testy</h1>
				<table class="table">
					<thead>
						<tr>
							<th>Id</th>
							<th>Tytuł</th>
						</tr>
					</thead>
					<tbody>
						{ testsList.map((test) => {
							return (
								<tr>
									<td><Link to={ "/test/" + test.id }>{ test.id }</Link></td>
									<td>{ test.title }</td>
								</tr>
							)
						}) }
					</tbody>
				</table>
			</div>
		</div>
	);
}
