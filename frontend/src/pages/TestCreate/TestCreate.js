import React, { useState } from "react";

export default function TestCreate()
{
    const [title, setTitle] = useState("")
    const [questions, setQuestions] = useState([])

    const questionList = questions.map((q, i) => {
        return (
            <div key={i}>
                <div className="form-inline row" key={i}>
                    <input className="form-control mr-2 mb-2" placeholder="Pytanie"
                            value={q.content}
                            onChange={(e) => { changeQuestion(i, "content", e.target.value) }} />
                    <select className="form-control mr-2 mb-2"
                            value={q.type}
                            onChange={(e) => { changeQuestion(i, "type", e.target.value) }}>
                        <option value="W">Wyboru</option>
                        <option value="O">Otwarte</option>
                        <option value="L">Liczbowe</option>
                    </select>
                    <button className="btn btn-danger mr-2 mb-2" 
                            onClick={deleteQuestion} name={i}>
                        Usuń
                    </button>
                </div>
                <div className="form-group row">
                        <input className="form-control" placeholder="Odpowiedzi" 
                                value={q.answers}
                                onChange={(e) => { changeQuestion(i, "answers", e.target.value) }}/>
                </div>
            </div>
        )
    })

    function appendQuestion() {
        let newQuestions = [...questions]
        newQuestions.push({
            content: "",
            type: "W",
            answers: ""
        })
        setQuestions(newQuestions)
    }

    function deleteQuestion(e) {
        let newQuestions = [...questions]
        newQuestions.splice(e.target.name, 1);
        setQuestions(newQuestions)
    }

    function changeQuestion(n, field, value) {
        let newQuestions = [...questions]
        newQuestions[n][field] = value;
        setQuestions(newQuestions)
    }

    function changeTitle(e) {
        setTitle(e.target.value)
    }

    function send() {
        let test = {
            title: title,
            questions: questions.map(q => {
                return {...q, lang: "PL", answers: q.answers.split(";").join("|")}
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
