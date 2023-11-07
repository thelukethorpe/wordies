import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("displays wordies", () => {
  render(<App />);
  const linkElement = screen.getByText(/wordies/i);
  expect(linkElement).toBeInTheDocument();
});
