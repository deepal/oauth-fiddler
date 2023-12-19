import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./NotFound";
import Callback from "./Callback";
import "./fira_code.ttf";
import { Container } from "@mui/system";
import { Grid, styled } from "@mui/material";
import Heading from "./Heading";

const AppContainer = styled(Container)(({ theme }) => ({
  paddingBottom: theme.spacing(3),
}));

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppContainer maxWidth="xl">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Heading />
        </Grid>
        <Grid item xs={12}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/callback" element={<Callback />} />
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </Grid>
      </Grid>
    </AppContainer>
  </React.StrictMode>
);
