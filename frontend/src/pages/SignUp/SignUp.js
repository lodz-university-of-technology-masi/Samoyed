import React from "react";
import "./SignUp.css";

export default function SignUp() {
  return (
        <div class="wrapper fadeInDown">
            <div id="formContent">
            
                <div class="fadeIn first">
                    <img alt="person icon" src="https://img.icons8.com/pastel-glyph/64/000000/person-male.png"/>
                </div>

                <form>
                <input type="text" id="login" class="fadeIn second" name="login" placeholder="Login" />
                <input type="text" id="password" class="fadeIn third" name="login" placeholder="Hasło" />
                <input type="submit" class="fadeIn fourth" value="Zaloguj się" />
                </form>

                <div id="formFooter">
                <a class="underlineHover" href="#">Zapomniałeś hasła?</a>
                </div>

            </div>
        </div>
  );
}
