import React, { useState, useEffect } from "react";
import "./NotFound.css";
import { Redirect } from "react-router";
import { useSelector } from "react-redux";

const NotFound = () => {
  const [redirect, setRedirect] = useState(false);
  const isLogged = useSelector(state => state.isLogged);

  useEffect(() => {
    setTimeout(() => setRedirect(true), 3000);
  }, []);

  return (
    <div className="NotFound">
      {redirect && <Redirect to="/" />}
      {isLogged ? <h2>Nie znaleziono strony :( </h2> : <h2>Brak dostępu!</h2>}
      <h3>Za 3 sekundy nastapi przekierowanie do strony głównej </h3>
    </div>
  );
};

export default NotFound;
