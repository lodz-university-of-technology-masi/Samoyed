import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import './Test.css'

const Test = props => {
  const { createdOn, id, versions, deleteTest, userGroup, assignToUser} = props;

  const renderCandidatesButtons = () => {
    return (
      <Link to={"/test" + id}>
        <button className="btn btn-primary mr-1">Rozwiąż</button>
      </Link>
    )
  }

  const renderRecruitersButtons = () => {
    return (
      <>
        <Link to={"/test/edit/" + id}>
          <button className="btn btn-primary mr-1">Edytuj</button>
        </Link>
        <Button
          className="btn btn-danger"
          onClick={e => {
            deleteTest(id);
          }}
        >
          Usuń
        </Button>
        <Button className="btn btn-success ml-1"
        onClick={e => {
          assignToUser();
        }}>
          Dodaj kandydata
        </Button>
      </>
    ) 
  }

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
          { userGroup === 'recruiters' ? renderRecruitersButtons() : renderCandidatesButtons()}
        </div>
      </td>
    </tr>
  );
};

export default Test;
