import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./Test.css";
import CandidatePicker from "../../CandidatePicker/CandidatePicker";
import apiRequest from "../../../../ApiRequest";

const Test = props => {
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(true);
  const { createdOn, id, versions, deleteTest, exportCSV, userGroup, assignCandidateToTest} = props;

  useEffect(() => {
    apiRequest({
      method: "GET",
      path: "fetchAllCandidates",
      success: function(res) {
        setUsers(JSON.parse(res.responseText));
        setLoading(false);
      },
      error: function(err) {
        console.log(err);
      }
    });
  }, []);

  const renderCandidatesButtons = () => {
    return (
      <Link to={"/test/" + id}>
        <button className="btn btn-primary mr-1">Rozwiąż</button>
      </Link>
    );
  };

  const renderRecruitersButtons = () => {
    return (
      <>
        <Link to={"/test/edit/" + id}>
          <button className="btn btn-primary mr-1">Edytuj</button>
        </Link>
        <Button
          className="btn btn-danger"
          onClick={() => {
            deleteTest(id);
          }}
        >
          Usuń
        </Button>
        <Button
          className="btn btn-primary ml-1"
          onClick={() => {
            exportCSV(id);
          }}
        >
          Pobierz CSV
        </Button>
        <Button
          className="btn btn-success ml-1"
          onClick={() => {
            setShow(true);
          }}
        >
          Dodaj kandydata
        </Button>
        <CandidatePicker
          assignCandidateToTest={(candidateId, testId) =>
            assignCandidateToTest(candidateId, testId)
          }
          loading={loading}
          users={users}
          title={versions[0].title}
          show={show}
          setShow={setShow}
          testId={id}
        />
      </>
    );
  };

  return (
    <tr>
      <td>
        {versions.map((v, j) => {
          return <div key={j}>{"[" + v.lang + "] " + v.title}</div>;
        })}
      </td>
      <td align="center">{new Date(createdOn).toLocaleDateString()}</td>
      <td align="center">
        <div className="table__content">
          {userGroup === "recruiters"
            ? renderRecruitersButtons()
            : renderCandidatesButtons()}
        </div>
      </td>
    </tr>
  );
};

export default Test;
