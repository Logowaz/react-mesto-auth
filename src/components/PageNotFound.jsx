import React from "react";
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="Error">
      <h1>Ошибка 404</h1>
      <h2>Страница не найдена</h2>
      <Link className="Error__navigate" to="/">Вернуться на главную страницу</Link>
    </div>
  )
};

export default PageNotFound;