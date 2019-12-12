import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Tests.css";
import apiRequest from "../../ApiRequest";
import Loader from "../../components/Loader";

export default function Tests()
{
	const [loaded, setLoaded] = useState(false)
	const [testsList, setTestsList] = useState([])

	useEffect(() => {
		apiRequest({
			method: "GET",
			path: "tests",
			success: function(res) {
				setTestsList(JSON.parse(res.responseText))
				setLoaded(true)
			},
			error: function(err) {
				console.log(err)
				// ??
			}
		})
	}, [])

	return (
		(loaded) ? (
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
		) : (<Loader />)
	);
}
