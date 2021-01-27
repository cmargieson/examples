import React, { createContext, useContext, useEffect, useState } from "react";
// Apollo
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client";
import { gql, useQuery } from "@apollo/client";
// Firebase
import firebase from "./firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
// Router
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation,
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
                <PublicPage />
              </Route>

              <PrivateRoute path="/profile">
                <ProfilePage />
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

const authContext = createContext();

const AuthProvider = ({ children }) => {
  // const auth = useProvideAuth();
  const [auth, setAuth] = useState({ user: null, loading: true });

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setAuth({ user, loading: false });
      } else {
        setAuth({ user: null, loading: false });
      }
    });
    return () => unsubscribe();
  }, []);

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

const useAuth = () => {
  return useContext(authContext);
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

const PublicPage = () => {
  const BOOKS = gql`
    query books {
      books {
        title
        author
        id
      }
    }
  `;

  const { loading, error, data } = useQuery(BOOKS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( {error.message}</p>;

  return (
    <>
      <h3>Books:</h3>

      {data.books.map(({ title, author, id }) => (
        <div key={id}>
          <p>
            {title}: {author}
          </p>
        </div>
      ))}
    </>
  );
};

const ProfilePage = () => {
  let history = useHistory();
  let auth = useAuth();

  console.log(auth.user);

  return (
    <>
      <h3>Profile</h3>

      {auth.user && (
        <>
          <p>{auth.user.email}</p>
          <button
            onClick={() =>
              firebase
                .auth()
                .signOut()
                .then(history.push("/"))
                .finally(client.resetStore())
            }
          >
            Logout
          </button>
        </>
      )}
    </>
  );
};

const LoginPage = () => {
  let location = useLocation();
  let auth = useAuth();

  let { from } = location.state || { from: { pathname: "/" } };

  if (auth.loading) {
    return <h1>Loading...</h1>;
  }

  return auth.user ? (
    <Redirect to={{ pathname: from.pathname }} />
  ) : (
    <div>
      <p>Login</p>

      <p>From: {from.pathname}</p>

      <StyledFirebaseAuth
        uiConfig={{
          callbacks: {
            signInSuccessWithAuthResult: () => false,
          },
          signInFlow: "popup",
          signInOptions: [
            {
              provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
              requireDisplayName: false,
            },
          ],
        }}
        firebaseAuth={firebase.auth()}
      />
    </div>
  );
};

export default App;
