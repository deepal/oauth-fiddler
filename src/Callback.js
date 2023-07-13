import { Button, Grid, styled, TextField, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useQueryParams } from "./hooks";
import { Block, CodeBlock } from "./App";

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
  const [payload, setPayload] = useState("");
  const [exchangeResponse, setExchangeResponse] = useState(null);
  const queryParams = useQueryParams();
  const exchangeUrl = sessionStorage.getItem("tokenUrl");

  useEffect(() => {
    setPayload(
      new URLSearchParams({
        code: queryParams.get("code"),
        redirect_uri: sessionStorage.getItem("callbackUrl"),
        client_id: sessionStorage.getItem("clientId"),
        client_secret: sessionStorage.getItem("clientSecret"),
        scope: sessionStorage.getItem("scope"),
        grant_type: "authorization_code",
        code_verifier: sessionStorage.getItem("pkceVerifier"),
      }).toString()
    );
  }, [queryParams]);

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
    error: {
      title: "Error",
      value: queryParams.get("error"),
    },
  };

  const sendExchangeRequest = async () => {
    const res = await fetch(exchangeUrl, {
      method: "post",
      body: payload,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const data = await res.json();
    setExchangeResponse(JSON.stringify(data, null, 2));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
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
      </Grid>
      <Grid item xs={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6">Exchange Request Preview</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Grid container>
                    <Block item xs={12}>
                      <CodeBlock>
                        POST {exchangeUrl}
                        <br />
                        {payload.replace(/&/gi, "\n&")}
                      </CodeBlock>
                    </Block>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={sendExchangeRequest}>
                Exchange Authorization Code for Tokens
              </Button>
            </Grid>
            {exchangeResponse && (
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      Exchange Response
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container>
                      <Block item xs={12}>
                        <CodeBlock>
                          {exchangeResponse}
                        </CodeBlock>
                      </Block>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
    </Grid>
  );
}
