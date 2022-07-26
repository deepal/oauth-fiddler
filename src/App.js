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
  Tooltip,
  Typography,
} from "@mui/material";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import GoogleIcon from "./icons/GoogleIcon";
import FacebookIcon from "./icons/FacebookIcon";
import { grey } from "@mui/material/colors";

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

const ProviderPanel = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: grey[100],
  borderRadius: theme.shape.borderRadius,
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
const OAUTH_PROVIDERS = [
  {
    name: "Google",
    authoriseUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    icon: <GoogleIcon />,
  },
  {
    name: "Facebook",
    authoriseUrl: "https://www.facebook.com/v14.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v14.0/oauth/access_token",
    icon: <FacebookIcon />,
  },
];

function App() {
  const [authoriseUrl, setAuthoriseUrl] = useState("");
  const [tokenUrl, setTokenUrl] = useState("");
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
  const prefillProvider = (provider) => {
    setAuthoriseUrl(provider.authoriseUrl);
    setTokenUrl(provider.tokenUrl);
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
                <Grid container>
                  <ProviderPanel item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body1">
                          Click on an existing provider to pre-fill URLs, or enter details manually.
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={2}>
                          {OAUTH_PROVIDERS.map((provider) => (
                            <Grid item key={provider.name}>
                              <Button
                                variant="container"
                                startIcon={provider.icon}
                                onClick={prefillProvider.bind(null, provider)}
                              >
                                {provider.name}
                              </Button>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    </Grid>
                  </ProviderPanel>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Block item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6">Request Parameters</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
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
                                label="Token URL"
                                variant="outlined"
                                value={tokenUrl}
                                onChange={createChangeHandler(setTokenUrl)}
                              />
                            </Grid>
                          </Grid>
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
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="State"
                            variant="outlined"
                            value={state}
                            onChange={createChangeHandler(setState)}
                          />
                        </Grid>
                        <Grid item xs={6}>
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
                          <Tooltip title="Code Challenge is derived from the Code Verifier and cannot be changed">
                          <TextField
                            fullWidth
                            label="Code Challenge"
                            value={pkceChallenge}
                            disabled
                            variant="outlined"
                          />
                          </Tooltip>
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
