import React, { useState } from "react";

export default function TestCreate()
{
    const [title, setTitle] = useState("")
    const [questions, setQuestions] = useState([])

    // Renders block of modifiable questions
    const questionList = questions.map((q, i) => {
        // Depending on question type, this renders different blocks for typing
        // answers in
        let answersBlock;
        if (q.type === "W") {
            answersBlock = []
            for (let m = 0; m < 4; m++) {
                answersBlock.push(<>
                    <input className="form-check-input" type="checkbox" 
                            onChange={e => { changeAnswersCorrect(i, m, e.target.checked) }}
                            checked={q.answers[m].correct} />
                    <input className="form-control mr-2" placeholder={"Odpowiedź " + (m+1)}
                            onChange={e => { changeAnswersComplex(i, m, e.target.value) }}
                            value={q.answers[m].value} />
                </>)
            }
            answersBlock = (
                <div className="form-group form-inline row">
                    {answersBlock}
                </div>
            )
        } else {
            answersBlock = (
                <div className="form-group row">
                    <input className="form-control" placeholder="Odpowiedzi" 
                            value={q.answers}
                            onChange={(e) => { changeAnswersSimple(i, e.target.value) }}/>
                </div>
            )
        }
        return (
            <div key={i}>
                <div className="form-inline row" key={i}>
                    <input className="form-control mr-2 mb-2" placeholder="Pytanie"
                            value={q.content}
                            onChange={(e) => { changeContent(i, e.target.value) }} />
                    <select className="form-control mr-2 mb-2"
                            value={q.type}
                            onChange={(e) => { changeType(i, e.target.value) }}>
                        <option value="W">Wyboru</option>
                        <option value="O">Otwarte</option>
                        <option value="L">Liczbowe</option>
                    </select>
                    <button className="btn btn-danger mr-2 mb-2" 
                            onClick={deleteQuestion} name={i}>
                        Usuń
                    </button>
                </div>
                {answersBlock}
            </div>
        )
    })

    function appendQuestion() {
        let newQuestions = [...questions]
        newQuestions.push({
            content: "",
            type: "W",
            answers: [
                {value:"", correct:true},
                {value:"", correct:false},
                {value:"", correct:false},
                {value:"", correct:false}
            ]
        })
        setQuestions(newQuestions)
    }

    function deleteQuestion(e) {
        let newQuestions = [...questions]
        newQuestions.splice(e.target.name, 1);
        setQuestions(newQuestions)
    }

    // Data handlers
    function changeContent(n, value) {
        let newQuestions = [...questions]
        newQuestions[n].content = value;
        setQuestions(newQuestions)
    }

    function changeType(n, value) {
        let newQuestions = [...questions]
        newQuestions[n].type = value;
        if (value === "W") {
            newQuestions[n].answers = [
                    {value:"", correct:true},
                    {value:"", correct:false},
                    {value:"", correct:false},
                    {value:"", correct:false}
                ]
        } else {
            newQuestions[n].answers = ""
        }
        setQuestions(newQuestions)
    }

    function changeAnswersSimple(n, value) {
        let newQuestions = [...questions]
        newQuestions[n].answers = value;
        setQuestions(newQuestions)
    }

    function changeAnswersComplex(n, m, value) {
        let newQuestions = [...questions]
        newQuestions[n].answers[m].value = value;
        setQuestions(newQuestions)
    }

    function changeAnswersCorrect(n, m, value) {
        let newQuestions = [...questions]
        newQuestions[n].answers[m].correct = value;
        setQuestions(newQuestions)
    }

    function changeTitle(e) {
        setTitle(e.target.value)
    }

    function send() {
        let test = {
            title: title,
            questions: questions.map(q => {
                if (q.type === "W") {
                    // For type W, concat all answers into string "value;correct",
                    // then concat all answers together with ";"
                    return {
                        ...q, 
                        lang: "PL",
                        answers: q.answers.map(a => {
                            return a.value + ";" + a.correct
                        }).join(";")
                    }
                } else {
                    // For any other type, just concat with ";"
                    return {...q, lang: "PL", answers: q.answers.split(";").join("|")}
                }
            })
        }
        console.log(JSON.stringify(test))
    }

    return (<>
        <h3>Utwórz nowy test</h3>
        <div className="form-group row">
            <input className="form-control" placeholder="Tytuł" onChange={changeTitle} />
        </div>
        {questionList}
        <div className="form-group row">
            <button className="btn btn-primary col-12 mb-2" onClick={appendQuestion}>Dodaj pytanie</button>
            <button className="btn btn-primary col-12" onClick={send}>Zapisz</button>
        </div>
    </>)
}
