import React, { useState, useEffect } from "react";
import apiRequest from "../../ApiRequest"
import Loader from "../../components/Loader";

export default function TestView(props)
{
	const [params] = useState({...props.match.params})
	const [loaded, setLoaded] = useState(false)
	const [id, setId] = useState("")
	const [title, setTitle] = useState("")
	const [questions, setQuestions] = useState([])
	const [answers, setAnswers] = useState([])

	// Load question from API
	useEffect(() => {
		apiRequest({
			method: "GET",
			path: "tests/id/" + params.id,
			success: function(res) {
				let test = JSON.parse(res.responseText)
				setId(test.id)
				setTitle(test.title)
				setQuestions(test.questions)
				setLoaded(true)
			},
			error: function(err) {
				console.log(err)
				// ??
			}
		})
	}, [params.id])
	
	// Renders all the divs containing different types of questions
	const questionsView = questions.map((q, i) => {
		let divs = []
		// Title
		let heading = (
			<div className="card-header">
				{i + 1 + ". " + q.content}
			</div>
		)
		// Questions
		if (q.type === "W") {
			// Close question
			let answers = q.answers.split("|")
			for (let n in answers) {
				divs.push(
					<div className="form-check" key={"answer" + i + "." + n}>
						<label className="form-check-label">
							<input onChange={updateAnswer} className="form-check-input" 
									type="radio" name={i} value={n} />
							{answers[n]}
						</label>
					</div>
				)
			}
		} else if (q.type === "O") {
			// Open question
			divs.push(
				<input onChange={updateAnswer} className="form-control form-control-sm" 
						name={i} placeholder="Odpowiedź" key={"answer" + i} />
			)
		} else if (q.type === "L") {
			// Number value
			divs.push(
				<input onChange={updateAnswer} className="form-control form-control-sm" 
						type="number" name={i} placeholder="Odpowiedź" key={"answer" + i} />
			)
		}
		return (
			<div className="card mb-3" key={"question" + i}>
				{heading}
				<div className="card-body">{divs}</div>
			</div>
		)
	})

	function updateAnswer(e) {
		let newAnswers = [...answers]
		newAnswers[e.target.name] = e.target.value
		setAnswers(newAnswers)
	}

	function send(e) {
		let answerSheet = {
			id: id,
			answers: answers
		}
		console.log(answerSheet)
		e.preventDefault()
	}

	return (
		(loaded) ? (
		<>
			<h1>{title}</h1>
			{questionsView}
			<button className="btn btn-primary col-12" onClick={send}>Zapisz i zakończ test</button>
		</>
		) : (<Loader />)
	);
}
