import React from "react";
import ReactDOM from "react-dom";
import { render, screen } from "@testing-library/react";

import { Button } from "./";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Button />, div);
});

it("renders label", () => {
  render(<Button label="My Test Button"></Button>);
  expect(screen.getByText("My Test Button")).toBeInTheDocument();
});
