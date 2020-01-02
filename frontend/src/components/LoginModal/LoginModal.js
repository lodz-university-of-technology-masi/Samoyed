import React, { useState } from "react";
import "./LoginModal.css";
import Loader from "../UI/Loader/Loader";
import apiRequest from "../../ApiRequest";
import { useDispatch, useSelector } from "react-redux";
import { userLogIn } from "../../redux/actions/userLogIn";
import { userLogOut } from "../../redux/actions/userLogOut";
import { withRouter } from 'react-router-dom';

function LoginModal(props) {
  const dispatch = useDispatch();
  const loggedUser = useSelector(state => state);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    login: "",
    password: ""
  });

  function handleChange(e) {
    let newUser = { ...user };
    newUser[e.target.name] = e.target.value;
    setUser(newUser);
  }

  function logIn(e) {
    setIsLoading(true);
    apiRequest({
      method: "POST",
      path: "user/signin/",
      body: {
        username: user.login,
        password: user.password
      },
      success: function(res) {
        setIsLoading(false);
        let tokens = JSON.parse(res.responseText);
        dispatch(userLogIn(tokens, "DZIALAM"));
      },
      error: function(err) {
        setIsLoading(false);
        alert("SOMETHING IS NOT QUITE RIGHT...");
        // ??
      }
    });
    props.history.push("/")
    e.preventDefault();
  }

  function logOut(e) {
    dispatch(userLogOut());
    e.preventDefault();
  }

  return (
    <div className="wrapper fadeInDown">
      <div id="formContent">
        <div className="fadeIn first">
          <img
            alt="person icon"
            src="https://img.icons8.com/pastel-glyph/64/000000/person-male.png"
          />
        </div>

        {loggedUser.isLogged ? (
          <form>
            Zalogowano jako <b>{loggedUser.data.email}</b>
            <input
              type="submit"
              className="fadeIn fourth"
              value="Wyloguj się"
              onClick={logOut}
            />
          </form>
        ) : (
          <form>
            {isLoading ? (
              <Loader size="100px">
                <h4>Logowanie...</h4>
              </Loader>
            ) : (
              <>
                <input
                  type="text"
                  id="login"
                  className="fadeIn second"
                  name="login"
                  placeholder="Login"
                  value={user.login}
                  onChange={handleChange}
                />
                <input
                  type="password"
                  id="password"
                  className="fadeIn third"
                  name="password"
                  placeholder="Hasło"
                  value={user.password}
                  onChange={handleChange}
                />
                <input
                  type="submit"
                  className="fadeIn fourth"
                  value="Zaloguj się"
                  onClick={logIn}
                />
              </>
            )}
          </form>
        )}

        <div id="formFooter">
          <a className="underlineHover" href="/">
            Zapomniałeś hasła?
          </a>
        </div>
      </div>
    </div>
  );
}

export default withRouter(LoginModal);