import React from "react";
import "./Home.css";
import LoginModal from "../../components/LoginModal/LoginModal";

export default function Home() {
  return (
    <div className="Home">
      <div className="lander">
        <LoginModal/>
        <h1>Home</h1>
        <p>Oto nasza (pusta) strona startowa</p>
      </div>
    </div>
  );
}
