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
		(loaded) ? (<>
			<table className="table">
				<thead>
					<tr>
						<th>Tytuł</th>
						<th>Utworzono</th>
						<th>Akcje</th>
					</tr>
				</thead>
				<tbody>
					{ testsList.map((test, i) => {
						return (
							<tr key={i}>
								<td>
									{ test.versions.map((v, j) => {
										return <div key={j}>{ "[" + v.lang + "] " + v.title }</div>
									})}
								</td>
								<td>{ new Date(test.createdOn).toLocaleDateString() }</td>
								<td>
									<Link to={"/test/" + test.id}>
										<button className="btn btn-primary mr-1">Edytuj</button>
									</Link>
									<Link to={"/test/" + test.id}>
										<button className="btn btn-danger">Usuń</button>
									</Link>
								</td>
							</tr>
						)
					}) }
				</tbody>
			</table>
			<Link to="/test/create" className="row">
				<button className="btn btn-primary col-12">Dodaj nowy test</button>
			</Link>
		</>) : (<Loader />)
	);
}
