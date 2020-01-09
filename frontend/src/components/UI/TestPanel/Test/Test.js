import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const Test = props => {
  const { createdOn, id, versions, deleteTest, userGroup} = props;

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
      <td>{new Date(createdOn).toLocaleDateString()}</td>
      <td>
        { userGroup === 'recruiters' ? renderRecruitersButtons() : renderCandidatesButtons()}
      </td>
    </tr>
  );
};

export default Test;
