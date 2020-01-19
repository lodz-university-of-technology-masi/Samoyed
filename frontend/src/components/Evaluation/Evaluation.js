import React, { useState, useEffect, version } from "react";
import apiRequest from "../../ApiRequest";
import Loader from "../../components/UI/Loader/Loader";
import { Row } from "react-bootstrap";

const Evaluation = props => {
    const [params] = useState({ ...props.match.params });
    const [loaded, setLoaded] = useState(false);
    const [versions, setVersions] = useState([]);
    const [evaluations, setEvaluations] = useState([]);
    const [viewVersion, setViewVersion] = useState(-1);

    useEffect(() => {
        apiRequest({
            method: "GET",
            path: "SolvedTestGetById/id/" + params.id,
            success: function(res) {
                let solvedTest = JSON.parse(res.responseText);
                setVersions(solvedTest.versions);
                setViewVersion(0);
                setLoaded(true);
            },
            error: function(err) {
                console.log(err);
            }

        });
    }, [params.id]);

    function changeVersion(e) {
        setViewVersion(e.target.value);
    }

    const evaluateAnswer = e => {
        let newEvaluations = [...evaluations];
        newEvaluations[e.target.name] = e.target.value;
        setEvaluations(newEvaluations);
    }

    const send = e => {
        let evaluationSheet = {
            lang: "PL",
            evaluations: evaluations
        };
        console.log(evaluationSheet);
        apiRequest({
            method: "PUT",
            path: "SolvedTestEvaluation/id/" + params.id,
            body: evaluationSheet,
            success: function(res) {
                console.log(res);
            },
            error: function(err) {
                console.log(err);
            }
        });
    }


    const answersView = () => {
        if (viewVersion < 0) return "";
        let map = versions[viewVersion].questions.map((q,i) => {
            let divs = [];
            let heading = (
                <div className="card-header">{i + 1 + ". " + q.content}</div>
            );
            divs.push(
                <div key={i}>  
                    <Row style={{fontSize: '1.2em', fontWeight: 'bold'}} className="m-2">Odpowiedź użytkownika: </Row>
                    <Row style={{fontSize: '1.0em'}} className="m-2">{q.answers}</Row>
                    <hr/>
                    <div className="form-check" key={"evaluation" + i}>
                        <div>
                            <label className="form-check-label">
                                <input
                                    onChange={evaluateAnswer}
                                    className="form-check-input"
                                    type="radio"
                                    name={i}
                                    value="false"
                                />
                                Odpowiedź niepoprawna ❌
                            </label>
                        </div>
                        <div>
                            <label className="form-check-label">
                                <input
                                    onChange={evaluateAnswer}
                                    className="form-check-input"
                                    type="radio"
                                    name={i}
                                    value="true"
                                />
                                Odpowiedź poprawna ✔️
                            </label>
                        </div>
                    </div>
                </div>
            )
            return (
                <div className="card mb-3" key={"question" + i}>
                    {heading}
                    <div className="card-body">{divs}</div>
                </div>
              );
        });
        return map;
    }

    return loaded ? (
        <>
            {viewVersion >= 0 ? (
                    <div className="form-inline">
                    <select className="form-control" onChange={changeVersion}>
                        {versions.map((v, i) => {
                        return <option key={i} value={i}>{v.lang}</option>;
                        })}
                    </select>
                    <h1 className="ml-3">{versions[viewVersion].title}</h1>
                    </div>
            ) : (
                ""
            )}
            {answersView()}
            <button className="btn btn-primary col-12" onClick={send}>
                Zapisz i zakończ test
            </button>
        </>
    ) : (
        <Loader>
            <h1>Ładowanie...</h1>
        </Loader>
    );
}


export default Evaluation;