import React from "react"
import logo from "../images/logo.svg";
import {useLocation} from "react-router-dom"
import { Link } from "react-router-dom";

function Header({loggedIn, userMail, singOut}) {
  const location = useLocation();
  return (
    <>
      <header className="header">
      <img src={logo} className="header__logo" alt="логотип Место" />
        {loggedIn ? (
          <div className="header__profile-place">
            <p className="header__email">{userMail}</p>
            <Link onClick={singOut} to="/signin" className="header__singout">Выйти</Link> 
          </div> ) : (
            <>
              {location.pathname === "/signup" ? 
                (<Link className="auth_button" to="/signin">Войти</Link>) :
                (<Link className="auth_button" to="/signup">Регистрация</Link>)   
                }
            </>
          )}
    </header>
    <div className="header__line"></div>
    </>
  );
}

export default Header;
