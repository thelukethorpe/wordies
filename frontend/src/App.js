import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Paths from "./constants/Paths";
import { ThemeProvider, themes } from "./theme";
import { useState } from "react";
import HomePage from "./pages/HomePage";
import CrosswordPage from "./pages/CrosswordPage";

export default function App() {
  const [theme] = useState(themes.default);
  return (
    <ThemeProvider>
      <div className="App" style={{ backgroundColor: theme.backgroundColor }}>
        <Router>
          <Routes>
            <Route path={Paths.CROSSWORD} element={<CrosswordPage />} />
            <Route path={Paths.HOME} element={<HomePage />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}
