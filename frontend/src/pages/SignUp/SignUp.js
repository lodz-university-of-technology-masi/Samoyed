import React, { useState } from "react";
import "./SignUp.css";
import LoginModal from "../../components/LoginModal/LoginModal";

export default function SignUp() {
  const [mode, setMode] = useState(false);

  return (
    <div className="SignUp">
      <div className="lander">
        <LoginModal/>
      </div>
    </div>
  );
}
