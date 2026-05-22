import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("react-p5-wrapper", () => ({
  ReactP5Wrapper: () => null,
}));

import App from "./components/App";
import { ThemeProvider } from "./context/ThemeContext";

test("renders game title", () => {
  render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
  expect(screen.getByText(/CIRCLES/i)).toBeInTheDocument();
});
