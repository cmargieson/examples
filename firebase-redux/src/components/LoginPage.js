import React, { useState } from "react";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import Snackbar from "@material-ui/core/Snackbar";
import TextField from "@material-ui/core/TextField";
// Redux
import { connect } from "react-redux";
import { resetError, signInWithEmailAndPassword } from "../redux/authActions";
// Router
import { Redirect, useHistory, useLocation } from "react-router-dom";

const useStyles = makeStyles(() => ({
  // Centre contents
  container: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

const LoginPage = ({
  signInWithEmailAndPassword,
  authError,
  userModel,
  resetError,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  // Check state for redirect from <PrivateRoute>
  const from = location.state || { referrer: { pathname: "/" } };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return userModel ? (
    <Redirect to={from.referrer} />
  ) : (
    <React.Fragment>
      <div className={classes.container}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <TextField
              autoComplete="email"
              fullWidth
              label="Email address"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <TextField
              autoComplete="current-password"
              fullWidth
              label="Password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              onClick={() => signInWithEmailAndPassword(email, password)}
            >
              Login
            </Button>
          </Grid>
          <Grid item>
            <Link
              href="#"
              onClick={(event) => {
                event.preventDefault();
                history.push("/signup");
              }}
            >
              Don't have an account? Sign up.
            </Link>
          </Grid>
        </Grid>
      </div>

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={Boolean(authError)}
        autoHideDuration={6000}
        onClose={() => resetError()}
        message={(authError && authError.message) || ""}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => resetError()}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  userModel: state.auth.userModel,
  authError: state.auth.authError,
});

const mapDispatchToProps = (dispatch) => ({
  signInWithEmailAndPassword: (email, password) =>
    dispatch(signInWithEmailAndPassword(email, password)),
  resetError: () => dispatch(resetError()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
