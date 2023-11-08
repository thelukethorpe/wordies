import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("displays crosswords", () => {
  render(<App />);
  const linkElement = screen.getByText(/crosswords/i);
  expect(linkElement).toBeInTheDocument();
});
