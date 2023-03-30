import { cyan } from "@mui/material/colors";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BasePage from "./components/misc/BasePage";
import HomePage from "./components/pages/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <BasePage>
        <HomePage />
      </BasePage>
    ),
  },
]);

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: cyan[900],
    },
  },
});

console.log(crossOriginIsolated);

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
