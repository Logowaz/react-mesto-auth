import React from "react"
import AuthTemplate from "./AuthTemplate";

function Register({handleCheckRegister}) {
  return (
       <AuthTemplate name={'register'} title={'Регистрация'}  textButton={'Зарегестрироваться'} handleCheckRegister={handleCheckRegister} />
  )
};

export default Register;