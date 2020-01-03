import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const Test = props => {
  const { i, createdOn, id, versions, deleteTest } = props;

  return (
    <tr key={i}>
      <td>
        {versions.map((v, j) => {
          return <div key={j}>{"[" + v.lang + "] " + v.title}</div>;
        })}
      </td>
      <td>{new Date(createdOn).toLocaleDateString()}</td>
      <td>
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
      </td>
    </tr>
  );
};

export default Test;
