import React from "react"
import logo from "../images/logo.svg";
// import {useLocation, Link} from "react-router-dom"

// function Header({loggedIn, emailUser, singOut}) {
//   const location = useLocation();

//   return (
//     <header className="auth">
//       <img src={logo} className="header__logo" alt="логотип Место" />
//       {loggedIn ? (
//         <div className="header__profile-place">
//           <p className="header__email">{emailUser}</p>
//           <Link onClick={singOut} to="/sign-in" className="header__singout">Выйти</Link> 
//         </div> ) : (
//           <>
//             {location.pathname === "/sign-up" ? 
//               (<Link className="auth_button" to="/sign-in">Войти</Link>) :
//               (<Link className="auth_button" to="/sign-up">Регистрация</Link>)   
//             }
//           </>
//       )}
//       <div className="header__line"></div>
//     </header>
//   );
// }

// export default Header;
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
            <Link onClick={singOut} to="/sign-in" className="header__singout">Выйти</Link> 
          </div> ) : (
            <>
              {location.pathname === "/sign-up" ? 
                (<Link className="auth_button" to="/sign-in">Войти</Link>) :
                (<Link className="auth_button" to="/sign-up">Регистрация</Link>)   
                }
            </>
          )}
    </header>
    <div className="header__line"></div>
    </>
  );
}

export default Header;
