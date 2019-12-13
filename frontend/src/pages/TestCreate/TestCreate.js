import React, { useState } from "react";

export default function TestCreate()
{
    const [title, setTitle] = useState({"PL":"", "EN":""})
    const [version, setVersion] = useState("PL")
    const [questions, setQuestions] = useState({"PL": [], "EN": []})

    function changeVersion(e) {
        setVersion(e.target.value)
    }

    function appendQuestion() {
        let newQuestions = {...questions}
        let q = {
                    content: "",
                    type: "O",
                    answers: ""
                }
        newQuestions["PL"].push({...q})
        newQuestions["EN"].push({...q})
        setQuestions(newQuestions)
    }

    function deleteQuestion(e) {
        let newQuestions = {...questions}
        newQuestions["PL"].splice(e.target.name, 1);
        newQuestions["EN"].splice(e.target.name, 1);
        setQuestions(newQuestions)
    }

    function changeType(n, value) {
        let newQuestions = {...questions}
        newQuestions["PL"][n].type = value;
        newQuestions["EN"][n].type = value;
        if (value === "W") {
            let q = [
                        {value:"", correct:true},
                        {value:"", correct:false},
                        {value:"", correct:false},
                        {value:"", correct:false}
                    ]
            newQuestions["PL"][n].answers = [...q]
            newQuestions["EN"][n].answers = [...q]
        } else {
            newQuestions["PL"][n].answers = ""
            newQuestions["EN"][n].answers = ""
        }
        setQuestions(newQuestions)
    }

    // Data handlers
    function changeContent(n, value) {
        let newQuestions = {...questions}
        newQuestions[version][n].content = value;
        setQuestions(newQuestions)
    }

    function changeAnswersSimple(n, value) {
        let newQuestions = {...questions}
        newQuestions[version][n].answers = value;
        setQuestions(newQuestions)
    }

    function changeAnswersComplex(n, m, value) {
        let newQuestions = {...questions}
        newQuestions[version][n].answers[m].value = value;
        setQuestions(newQuestions)
    }

    function changeAnswersCorrect(n, m, value) {
        let newQuestions = {...questions}
        newQuestions[version][n].answers[m].correct = value;
        setQuestions(newQuestions)
    }

    function changeTitle(e) {
        let newTitle = {...title}
        newTitle[version] = e.target.value;
        setTitle(newTitle)
    }

    function send() {
        let test = {
            versions: []
        }
        // Add versions
        for (let v in questions) {
            if (title[v].length > 0) {
                let n = test.versions.length;
                test.versions[n] = {}
                test.versions[n].lang = v
                test.versions[n].title = title[v]
                test.versions[n].questions = questions[v].map(q => {
                    if (q.type === "W") {
                        // Format all choice answers into single string
                        let answers = q.answers.map(a => {
                            return a.value + ";;" + a.correct
                        })
                        answers = answers.join("|")
                        return {...q, answers: answers}
                    }
                    return {...q}
                })
            }
        }
        console.log(test)
    }

    // Renders block of modifiable questions
    const questionList = questions[version].map((q, i) => {
        // Depending on question type, this renders different blocks for possible answers
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

    return (<>
        <div className="form-inline row mb-2">
            <select className="form-control" value={version} onChange={changeVersion}>
                <option value="PL">PL</option>
                <option value="EN">EN</option>
            </select>
            <label className="form-check-label ml-2">Wersja językowa</label>
        </div>
        <div className="form-group row">
            <input className="form-control" placeholder="Tytuł" onChange={changeTitle} value={title[version]} />
            <small id="passwordHelpBlock" class="form-text text-muted">
                Jeśli pozostawisz to pole puste, wybrana wersja językowa zostanie zignorowana.
            </small>
        </div>
        {questionList}
        <div className="form-group row">
            <button className="btn btn-primary col-12 mb-2" onClick={appendQuestion}>Dodaj pytanie</button>
            <button className="btn btn-primary col-12" onClick={send}>Zapisz</button>
        </div>
    </>)
}
