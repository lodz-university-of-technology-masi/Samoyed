import React, { useState, useEffect } from "react";

export default function TestView(props)
{
	const [params] = useState({...props.match.params})
	const [test, setTest] = useState({questions: []})

	useEffect(() => {
		var xmlHttp = new XMLHttpRequest()
		xmlHttp.open("GET", "https://8mx18wwru3.execute-api.us-east-1.amazonaws.com/dev/tests/id/" + params.id, false)
		xmlHttp.setRequestHeader("Accept", "application/json")
		xmlHttp.send(null)
		setTest(JSON.parse(xmlHttp.responseText))
	}, [params.id])
	
	const questionsList = test.questions.map((question, index) => {
		let answers = question.answers.split("|");
		return (
			<div className="closed_question" key={index}>
				<label htmlFor="answers_container">{question.content}:</label>
				<div className="answers_container">
					{ answers.map((answer, aIndex) => {
						return (
							<div className="form-check">
								<input className="form-check-input" type="radio" 
											name={"question" + index + "options"} 
											value={aIndex} />
								<label className="form-check-label">{ answer }</label>
							</div>
						)
					}) }
				</div>
			</div>
		)
	})

	return (
			<form>
				<h3>{test.title}</h3>
				{ questionsList }
			</form>
	);
}
