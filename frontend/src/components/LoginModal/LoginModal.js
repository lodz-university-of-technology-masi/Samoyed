import React from 'react'
import "./LoginModal.css"

export default function LoginModal() {
    return (
        <div className="wrapper fadeInDown">
            <div id="formContent">
                <div className="fadeIn first">
                    <img alt="person icon" src="https://img.icons8.com/pastel-glyph/64/000000/person-male.png"/>
                </div>

                <form>
                    <input type="text" id="login" className="fadeIn second" name="login" placeholder="Login" />
                    <input type="text" id="password" className="fadeIn third" name="login" placeholder="Hasło" />
                    <input type="submit" className="fadeIn fourth" value="Zaloguj się" />
                </form>

                <div id="formFooter">
                    <a className="underlineHover" href="/">Zapomniałeś hasła?</a>
                </div>
            </div>
        </div>
    )
}
