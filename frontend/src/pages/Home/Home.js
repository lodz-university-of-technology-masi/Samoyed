import React, { useEffect, useState } from "react";
import "./Home.css";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import apiRequest from "../../ApiRequest";
import { useSelector } from "react-redux";

export default function Home() {
  const [testsList, setTestsList] = useState([]);

  const isLogged = useSelector(state => state.isLogged);

  useEffect(() => {
    apiRequest({
      method: "GET",
      path: "tests",
      success: function(res) {
        setTestsList(JSON.parse(res.responseText));
      },
      error: function(err) {
        console.log(err);
      }
    });
  }, []);

  const nrOfTests = Object.keys(testsList).length;

  return (
    <div className="Home">
      <div className="lander">
        <h1>Witaj w naszej aplikacji!</h1>
        <h2>Liczba dostępnych testów:</h2>
        <p>
          {nrOfTests} {nrOfTests >= 5 ? "testów" : "testy"}
        </p>
        <div>
          <Link to="/login">
            {!isLogged && (
              <Button
                className="lander__button"
                size="lg"
                variant="outline-info"
              >
                Zaloguj się
              </Button>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
