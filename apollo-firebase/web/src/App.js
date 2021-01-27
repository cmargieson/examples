import React from "react";
// Apollo
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client";
// Components
import HomePage from "./Home";
import LoginPage from "./Login";
import ProfilePage from "./Profile";
// Firebase
import firebase from "./firebase";

// Hooks
import { AuthProvider, useAuth } from "./hooks";
// Router
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

// HttpLink
const httpLink = createHttpLink({
  uri: "http://localhost:5001/template-4d4c9/us-central1/graphql",
});

// Set context
const authLink = setContext(async (_, { headers }) => {
  // Get token from firebase
  const token = await firebase.auth().currentUser?.getIdToken(true);
  // Return headers to context
  return {
    headers: {
      ...headers,
      authorization: token ? token : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  // defaultOptions: {
  //   mutate: { errorPolicy: "ignore" },
  // },
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
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

            <Switch>
              <Route exact path="/">
                <HomePage />
              </Route>

              <PrivateRoute path="/profile">
                <ProfilePage cb={client.resetStore()} />
              </PrivateRoute>

              <Route path="/login">
                <LoginPage />
              </Route>
            </Switch>
          </div>
        </Router>
      </AuthProvider>
    </ApolloProvider>
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
