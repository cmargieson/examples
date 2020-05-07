import React from "react";
// Components
import NavBar from "./NavBar";
import Routes from "./Routes";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
// Redux
import { connect } from "react-redux";
// Router
import { BrowserRouter as Router } from "react-router-dom";

const useStyles = makeStyles(() => ({
  // Centre contents
  container: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

const App = ({ userReady }) => {
  const classes = useStyles();

  if (userReady) {
    return (
      <Router>
        <NavBar />
        <Routes />
      </Router>
    );
  }
  return (
    <div className={classes.container}>
      <CircularProgress />
    </div>
  );
};

const mapStateToProps = (state) => ({
  userReady: state.auth.userReady,
});

export default connect(mapStateToProps)(App);
