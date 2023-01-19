import React from "react";
import { Route, Routes } from "react-router-dom";

import RegisterAndEdit from "./pages/RegisterAndEdit";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";

const App = () => {
  return(
    <Routes>
        <Route path="/" element={<LoginPage />} exact/>
        <Route path="/edit" element={<RegisterAndEdit />} />
        <Route path="/register" element={<RegisterAndEdit />} />
        <Route path="/Home" element={<HomePage />} />
    </Routes>
   )
}

export default App;
