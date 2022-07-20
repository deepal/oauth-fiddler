import { Grid, styled, Typography } from "@mui/material";
import { green } from "@mui/material/colors";

const Banner = styled(Grid)(({ theme }) => ({
  backgroundColor: green[900],
  color: theme.palette.getContrastText(green[900]),
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

export default function Heading() {
  return (
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
    </Grid>
  );
}
