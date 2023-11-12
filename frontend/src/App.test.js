import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("displays crossword caption", () => {
  render(<App />);
  const linkElement = screen.getByText(/A classic word-deduction game with AI-generated clues/i);
  expect(linkElement).toBeInTheDocument();
});
