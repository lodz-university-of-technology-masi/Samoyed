import React from 'react';
import { Link } from "react-router-dom";
import Test from '../../Test/Test';

const RecruiterTestPanel = (props) => {
    const {testsList, deleteTest, refreshTest} = props;

    return (
        <>
        <table className="table">
          <thead>
            <tr>
              <th>Tytuł</th>
              <th>Utworzono</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {testsList.map((test, i) => {
              return (
                <Test
                  key={i}
                  createdOn={test.createdOn}
                  id={test.id}
                  versions={test.versions}
                  deleteTest={() => deleteTest(test.id)}
                />
              );
            })}
          </tbody>
        </table>
        <Link to="/test/create" className="row">
          <button className="btn btn-primary col-12">Dodaj nowy test</button>
        </Link>
        <div className="row">
        <button
          className="btn btn-danger col-12"
          onClick={e => {
            refreshTest();
          }}
        >
          Odśwież testy
        </button>
        </div>
      </>
    )
}

export default RecruiterTestPanel