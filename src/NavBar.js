import React from "react";
// Material UI
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
// Redux
import { connect } from "react-redux";
import { signOut } from "./redux/authActions";
// Router
import { useHistory } from "react-router-dom";

const NavBar = ({ userModel, signOut }) => {
  const history = useHistory();

  return (
    <AppBar position="static">
      <Toolbar>
        <Grid container direction="row" justify="flex-start">
          <Grid item>
            <Button color="inherit" onClick={() => history.push("/")}>
              Home
            </Button>

            <Button color="inherit" onClick={() => history.push("/protected")}>
              Protected
            </Button>
          </Grid>
        </Grid>

        <Grid container direction="row" justify="flex-end">
          <Grid item>
            {userModel ? (
              <Button color="inherit" onClick={() => signOut()}>
                Logout
              </Button>
            ) : (
              <Button color="inherit" onClick={() => history.push("/login")}>
                Login
              </Button>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

const mapStateToProps = (state) => ({
  userModel: state.auth.userModel,
});

const mapDispatchToProps = (dispatch) => ({
  signOut: () => dispatch(signOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
