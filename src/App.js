import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Radio,
  RadioGroup,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import Heading from "./Heading";

const Block = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

const RoundButton = styled(Button)(({ theme }) => ({
  height: 100,
  width: 100,
  borderRadius: 100,
}));

const CodeBlock = styled("code")(({ theme }) => ({
  whiteSpace: "pre-wrap",
  fontSize: "1em",
  lineHeight: "1.5",
  wordBreak: "break-all",
  fontFamily: "'Fira Code', monospace",
}));

function sha256(string) {
  const utf8 = new TextEncoder().encode(string);
  return crypto.subtle.digest("SHA-256", utf8).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((bytes) => bytes.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  });
}

const PKCE_TYPES = ["S256", "PLAIN"];
const RESPONSE_TYPES = ["code", "token", "id_token"];
const RESPONSE_MODES = ["query", "form_post", "fragment"];

function App() {
  const [authoriseUrl, setAuthoriseUrl] = useState(
    ""
  );
  const [callbackUrl, setCallbackUrl] = useState(
    "http://localhost:3000/callback"
  );
  const [clientId, setClientId] = useState(
    ""
  );
  const [scope, setScope] = useState("openid");
  const [state, setState] = useState(nanoid());
  const [nonce, setNonce] = useState(1234562);
  const [responseType, setResponseType] = useState([RESPONSE_TYPES[0]]);
  const [responseMode, setResponseMode] = useState(RESPONSE_MODES[0]);
  const [pkceEnabled, setPkceEnabled] = useState(false);
  const [pkceVerifier, setPkceVerifier] = useState("");
  const [pkceChallenge, setPkceChallenge] = useState("");
  const [pkceType, setPkceType] = useState(PKCE_TYPES[0]);
  const [queryString, setQueryString] = useState("");

  const createChangeHandler = (setterFn) => (e) => setterFn(e.target.value);
  const createCheckboxChangeHandler = (setterFn) => (e) =>
    setterFn(e.target.checked);
  const onChangeResponseType = (e) => {
    if (e.target.checked) {
      setResponseType((type) => [...type, e.target.name]);
    } else {
      setResponseType((type) => type.filter((t) => t !== e.target.name));
    }
  };
  const onStartOauth = (e) => {
    e.preventDefault();
    window.location.href = `${authoriseUrl}?${queryString}`;
  };

  useEffect(() => {
    const params = {
      client_id: clientId,
      redirect_uri: callbackUrl,
      scope,
      response_type: responseType,
      response_mode: responseMode,
      ...(pkceEnabled
        ? {
            code_challenge_method: pkceType,
            code_challenge: pkceChallenge,
          }
        : {}),
      state,
      nonce,
    };
    const qs = new URLSearchParams(params).toString();
    setQueryString(qs);
  }, [
    clientId,
    callbackUrl,
    scope,
    responseType,
    responseMode,
    state,
    nonce,
    pkceEnabled,
    pkceType,
    pkceChallenge,
  ]);

  useEffect(() => {
    if (pkceEnabled) {
      setPkceVerifier(nanoid());
    } else {
      setPkceVerifier("");
      setPkceChallenge("");
    }
  }, [pkceEnabled]);

  useEffect(() => {
    if (!pkceVerifier) return;
    if (pkceType === "S256") {
      sha256(pkceVerifier).then((result) => setPkceChallenge(result));
    } else {
      setPkceChallenge(pkceVerifier);
    }
  }, [pkceVerifier, pkceType]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Block item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6">Request Parameters</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Authorize URL"
                            variant="outlined"
                            value={authoriseUrl}
                            onChange={createChangeHandler(setAuthoriseUrl)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Callback URL"
                            variant="outlined"
                            value={callbackUrl}
                            onChange={createChangeHandler(setCallbackUrl)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Client ID"
                            variant="outlined"
                            value={clientId}
                            onChange={createChangeHandler(setClientId)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Scope"
                            variant="outlined"
                            value={scope}
                            onChange={createChangeHandler(setScope)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="State"
                            variant="outlined"
                            value={state}
                            onChange={createChangeHandler(setState)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Nonce"
                            variant="outlined"
                            value={nonce}
                            onChange={createChangeHandler(setNonce)}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Block>
              </Grid>
              <Grid item xs={12}>
                <Block item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6">Response Type</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl component="fieldset" variant="standard">
                        <FormGroup row>
                          {RESPONSE_TYPES.map((rt) => (
                            <FormControlLabel
                              key={rt}
                              control={
                                <Checkbox
                                  name={rt}
                                  checked={responseType.includes(rt)}
                                  onChange={onChangeResponseType}
                                />
                              }
                              label={rt}
                            />
                          ))}
                        </FormGroup>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Block>
              </Grid>
              <Grid item xs={12}>
                <Block item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6">PKCE Configuration</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="pkceEnabled"
                                onChange={createCheckboxChangeHandler(
                                  setPkceEnabled
                                )}
                                checked={pkceEnabled}
                              />
                            }
                            label="PKCE Enabled"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <FormControl component="fieldset" variant="standard">
                            <RadioGroup
                              row
                              value={pkceType}
                              onChange={createChangeHandler(setPkceType)}
                            >
                              {PKCE_TYPES.map((t) => (
                                <FormControlLabel
                                  key={t}
                                  control={
                                    <Radio disabled={!pkceEnabled} value={t} />
                                  }
                                  label={t}
                                />
                              ))}
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Code Verifier"
                            value={pkceVerifier}
                            disabled={!pkceEnabled}
                            variant="outlined"
                            onChange={createChangeHandler(setPkceVerifier)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Code Challenge"
                            value={pkceChallenge}
                            disabled={!pkceEnabled}
                            variant="outlined"
                            onChange={createChangeHandler(setPkceChallenge)}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Block>
              </Grid>
              <Grid item xs={12}>
                <Block item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6">Response Mode</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl component="fieldset" variant="standard">
                        <RadioGroup
                          row
                          value={responseMode}
                          onChange={createChangeHandler(setResponseMode)}
                        >
                          {RESPONSE_MODES.map((rm) => (
                            <FormControlLabel
                              key={rm}
                              control={<Radio value={rm} />}
                              label={rm}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Block>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Block item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6">Request Preview</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <CodeBlock>{`${authoriseUrl}?${queryString}`}</CodeBlock>
                  </Grid>
                </Grid>
              </Block>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container justifyContent="center">
          <RoundButton variant="contained" onClick={onStartOauth}>
            Start
          </RoundButton>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default App;
