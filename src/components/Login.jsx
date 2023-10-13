import React from "react"
import AuthTemplate from "./AuthTemplate";

function Login({handleCheckLogin}) {
  return (
    <AuthTemplate name={'login'} title={'Вход'}  textButton={'Войти'} handleCheckLogin={handleCheckLogin} />
  )
};

export default Login;