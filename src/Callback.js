import { Grid, styled, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Container } from "@mui/system";
import jwtDecode from "jwt-decode";
import React from "react";
import Heading from "./Heading";
import { useQueryParams } from "./hooks";

const AttributeBlock = styled("div")(({ theme }) => ({
  fontSize: 16,
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
  backgroundColor: grey[200],
  padding: theme.spacing(3),
  lineHeight: "1.5",
  borderRadius: theme.shape.borderRadius,
  fontFamily: "'Fira Code', monospace",
}));

export default function Callback() {
  const queryParams = useQueryParams();
  const data = {
    responseMethod: {
      title: "Response Method",
      value: queryParams.get("reponse_method"),
    },
    state: {
      title: "State",
      value: queryParams.get("state"),
    },
    code: {
      title: "Authorization Code",
      value: queryParams.get("code"),
    },
    idToken: {
      title: "ID Token",
      value: queryParams.get("id_token"),
    },
    idTokenPlain: {
      title: "ID Token (Decoded)",
      value: queryParams.get("id_token")
        ? JSON.stringify(jwtDecode(queryParams.get("id_token")), null, 2)
        : "",
    },
    accessToken: {
      title: "Access Token",
      value: queryParams.get("access_token"),
    },
  };
  return (
    <Grid container spacing={2}>
      {Object.entries(data)
        .filter(([k, { value }]) => !!value)
        .map(([key, { title, value }]) => (
          <Grid key={title} item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">{title}</Typography>
              </Grid>
              <Grid item xs={12}>
                <AttributeBlock severity="info" icon={false}>
                  {value}
                </AttributeBlock>
              </Grid>
            </Grid>
          </Grid>
        ))}
    </Grid>
  );
}
