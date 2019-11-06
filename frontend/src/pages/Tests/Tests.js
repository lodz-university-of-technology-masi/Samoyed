import React, { useState, useEffect } from "react";
import "./Tests.css";

export default function Tests()
{
  const [testsList, setTestsList] = useState([])

  useEffect(() => {
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.open("GET", "https://8mx18wwru3.execute-api.us-east-1.amazonaws.com/dev/tests", false)
    xmlHttp.setRequestHeader("Accept", "application/json")
    xmlHttp.send(null)
    setTestsList(JSON.parse(xmlHttp.responseText))
  }, [])

  return (
    <div className="Team">
      <div className="lander">
        <h1>Testy</h1>
        <table class="table">
          <thead>
            <tr>
              <th>Autor</th>
              <th>Tytuł</th>
              <th>Utworzono</th>
            </tr>
          </thead>
          <tbody>
            {
              testsList.map((test) => {
                return (<tr>
                  <td>{test.Author}</td>
                  <td>{test.Title}</td>
                  <td>{test.Created}</td>
                </tr>)
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
