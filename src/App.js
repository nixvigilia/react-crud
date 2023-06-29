import React, {useState, useEffect} from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  redirect,
} from "react-router-dom";
import Login from "./components/Login";
import TodoList from "./components/TodoList";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("accessToken"))
  );

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/todos" element={<TodoList />} />
      </Routes>
    </Router>
  );
};

export default App;
