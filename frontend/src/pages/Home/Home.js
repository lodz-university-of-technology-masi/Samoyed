import React, { useEffect, useState } from "react";
import "./Home.css";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import apiRequest from "../../ApiRequest";
import { useSelector } from "react-redux";

export default function Home() {
  const [testsList, setTestsList] = useState([]);
  const isLogged = useSelector(state => state.isLogged);
  const path = isLogged ? "tests" : "tests/all";
  
  useEffect(() => { 
    apiRequest({
      method: "GET",
      path,
      success: function(res) {
        setTestsList(JSON.parse(res.responseText));
      },
      error: function(err) {
        console.log(err);
      }

    });

    return () => {
        
    }
  }, [path]);

  const nrOfTests = Object.keys(testsList).length;

  return (
    <div className="Home">
      <div className="lander">
        <h1>Witaj w naszej aplikacji!</h1>
        <h2>Liczba {isLogged ? "dostępnych dla Ciebie" : "wszystkich dostępnych" } testów:</h2>
        <p>
          {nrOfTests} 
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
