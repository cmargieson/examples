import React from "react";
// Components
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
// Redux
import { connect } from "react-redux";
// Router
import { Switch, Route, Redirect } from "react-router-dom";

const useStyles = makeStyles(() => ({
  // Centre contents
  container: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

const Routes = ({ userModel }) => (
  <Switch>
    <Route path="/" exact>
      <HomePage />
    </Route>

    <Route path="/login">
      <LoginPage />
    </Route>

    <Route path="/signup">
      <SignupPage />
    </Route>

    <PrivateRoute userModel={userModel}>
      <ProtectedPage />
    </PrivateRoute>
  </Switch>
);

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated
const PrivateRoute = ({ children, userModel, location }) => {
  return userModel ? (
    children
  ) : (
    <Redirect
      to={{
        pathname: "/login",
        state: { referrer: location },
      }}
    />
  );
};

// Example component
const ProtectedPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <h3>Protected Page</h3>
    </div>
  );
};

// Example component
const HomePage = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <h3>Home Page</h3>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userModel: state.auth.userModel,
});

export default connect(mapStateToProps)(Routes);
