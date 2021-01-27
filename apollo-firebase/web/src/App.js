import React from "react";
// Apollo
import { client } from "./index.js";
// Components
import HomePage from "./Home";
import LoginPage from "./Login";
import ProfilePage from "./Profile";
// Hooks
import { useAuth } from "./hooks";
// Router
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

const App = () => {
  let auth = useAuth();

  if (auth.loading) return <h1>Loading...</h1>;

  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>

        <HomePage />

        <Switch>
          <PrivateRoute path="/profile">
            <ProfilePage cb={() => client.resetStore()} />
          </PrivateRoute>

          <Route path="/login">
            <LoginPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

// A wrapper for <Route>
const PrivateRoute = ({ children, ...rest }) => {
  let auth = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default App;
