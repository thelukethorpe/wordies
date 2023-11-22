import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Path } from "./constants/Path";
import { ThemeProvider, themes } from "./style/theme";
import { useState } from "react";
import HomePage from "./pages/HomePage";
import CrosswordPage from "./pages/CrosswordPage";

export default function App() {
  const [theme] = useState(themes.default);
  return (
    <ThemeProvider>
      <div style={{ backgroundColor: theme.backgroundColor }}>
        <Router>
          <Routes>
            <Route path={Path.Crossword} element={<CrosswordPage />} />
            <Route path={Path.Home} element={<HomePage />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}
