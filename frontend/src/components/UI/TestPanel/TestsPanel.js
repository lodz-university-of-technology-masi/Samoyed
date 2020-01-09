import React from 'react';
import { Link } from "react-router-dom";
import Test from './Test/Test';
import { useSelector } from 'react-redux';
import './TestsPanel.css';



const TestPanel = (props) => {
    const {testsList, deleteTest} = props;
    
    const userGroup = useSelector(state => state.data['cognito:groups'][0]);
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
                  userGroup={userGroup}
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
          { userGroup === 'recruiters' && <button className="btn btn-primary col-12">Dodaj nowy test</button> }
        </Link>
        
      </>
    )
}

export default TestPanel