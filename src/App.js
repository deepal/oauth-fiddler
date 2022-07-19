import {
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
import { green } from "@mui/material/colors";
import { Container } from "@mui/system";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

const Block = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

const Banner = styled(Grid)(({ theme }) => ({
  backgroundColor: green[900],
  color: theme.palette.getContrastText(green[900]),
  padding: theme.spacing(3),
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

const PKCE_TYPES = ["SHA256", "PLAIN"];
const RESPONSE_TYPES = ["code", "token", "id_token"];
const RESPONSE_MODES = ["query", "form_post", "fragment"];

function App() {
  const [authoriseUrl, setAuthoriseUrl] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('');
  const [clientId, setClientId] = useState('');
  const [scope, setScope] = useState('');
  const [state, setState] = useState('');
  const [nonce, setNonce] = useState('');
  const [responseType, setResponseType] = useState(RESPONSE_TYPES[0]);
  const [responseMode, setResponseMode] = useState(RESPONSE_MODES[0]);
  const [pkceEnabled, setPkceEnabled] = useState(false);
  const [pkceVerifier, setPkceVerifier] = useState('');
  const [pkceChallenge, setPkceChallenge] = useState('');
  const [pkceType, setPkceType] = useState(PKCE_TYPES[0]);

  useEffect(() => {
    if (pkceEnabled) {
      setPkceVerifier(nanoid())
    }
  }, [pkceEnabled])

  useEffect(() => {
    if (pkceVerifier) {
      sha256(pkceVerifier).then((result) => setPkceChallenge(result));
    }
  }, [pkceVerifier]);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Banner container>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h4" textAlign="center">
                  OAuth and OpenID Connect Fiddler
                </Typography>
              </Grid>
            </Grid>
          </Banner>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={7}>
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
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Callback URL"
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Client ID"
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Scope"
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="State"
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Nonce"
                              variant="outlined"
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
                                control={<Checkbox name={rt} />}
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
                              control={<Checkbox name="pkceEnabled" />}
                              label="PKCE Enabled"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FormControl
                              component="fieldset"
                              variant="standard"
                            >
                              <RadioGroup row value={pkceType}>
                                {PKCE_TYPES.map((t) => (
                                  <FormControlLabel
                                    key={t}
                                    control={<Radio value={t} />}
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
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Code Challenge"
                              value={pkceChallenge}
                              variant="outlined"
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
                          <RadioGroup row>
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
            <Grid item xs={5}>
              <Grid container>
                <Block item xs={12}>
                  <Grid item xs={12}>
                    <Typography variant="h6">Preview</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <code>foo</code>
                  </Grid>
                </Block>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
