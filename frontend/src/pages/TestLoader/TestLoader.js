import React, { useState, useEffect } from "react";
import apiRequest from "../../ApiRequest"
import Loader from "../../components/UI/Loader/Loader";
import TestCreate from "../TestCreate/TestCreate";

export default function TestLoader(props)
{
	const [params] = useState({...props.match.params})
	const [loaded, setLoaded] = useState(false)
	const [id, setId] = useState("")
	const [versions, setVersions] = useState([])
	let viewVersion = -1
    const [answers, setAnswers] = useState([])
	const [formattedData, setData] = useState([]);
	let test

	// Load question from API
	useEffect(() => {
		apiRequest({
			method: "GET",
			path: "tests/id/" + params.id,
			success: function(res) {
				test = JSON.parse(res.responseText)

				setId(test.id)
				setVersions(test.versions)
				formattedData.id = test.id
				formattedData.versions = test.versions
				viewVersion = test.versions.length
				formatData() 
			},	
			error: function(err) {
				console.log(err)
				// ??
			}
		})
	}, [params.id])


	const formatData = function() {

		if (viewVersion >= 0){
			for(var i = 0; i < test.versions.length; i++){
				for(var j = 0; j < test.versions[i].questions.length; j++){
					let question = {
						content: "",
						type: "", 
						answers: ""
					}
					question.content = test.versions[i].questions[j].content
					question.type = test.versions[i].questions[j].type
					if (test.versions[i].questions[j].type === "W") {
						// Close question
						question.answers = test.versions[i].questions[j].answers.split("|")
					} else {
						question.answers = test.versions[i].questions[j].answers;
					}
					formattedData.versions[i].questions[j] = question
				}
			}
		}
		setLoaded(true)
	}

	return (
        (loaded) ? 
        (<TestCreate edited={formattedData} />) 
        : 
        (<Loader><h1>Ładowanie...</h1></Loader>)
	);
}
