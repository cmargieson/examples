import React, { useContext, createContext, useEffect, useState } from "react";
// Apollo
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client";
import { useMutation, useQuery, gql } from "@apollo/client";
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

// Custom instance of HttpLink
const httpLink = createHttpLink({
  uri: "http://localhost:5001/template-4d4c9/us-central1/graphql",
});

// Set a context on your operation, which is used by other links further down
// the chain
const authLink = setContext(async (_, { headers }) => {
  // Ensure that the UI and store state reflects the current user's permissions
  // is to call client.resetStore() after your login or logout process has
  // completed

  // Get token from firebase
  const token = await firebase.auth().currentUser?.getIdToken(true);

  // Return the headers to the context so httpLink can read them
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

// This example has 3 pages: a public page, a protected page, and a login
// screen. In order to see the protected page, you must first login. Pretty
// standard stuff.
//
// First, visit the public page. Then, visit the protected page. You're not yet
// logged in, so you are redirected to the login page. After you login, you are
// redirected back to the protected page.
//
// Notice the URL change each time. If you click the back button at this point,
// would you expect to go back to the login page? No! You're already logged in.
// Try it out, and you'll see you go back to the page you visited just *before*
// logging in, the public page.

export default function AuthExample() {
  return (
    <ApolloProvider client={client}>
      <ProvideAuth>
        <Router>
          <div>
            <ul>
              <li>
                <Link to="/public">Public Page</Link>
              </li>
              <li>
                <Link to="/protected">Protected Page</Link>
              </li>
            </ul>

            <Switch>
              <Route path="/public">
                <PublicPage />
              </Route>
              <Route path="/login">
                <LoginPage />
              </Route>
              <PrivateRoute path="/protected">
                <ProtectedPage />
              </PrivateRoute>
            </Switch>
          </div>
        </Router>
      </ProvideAuth>
    </ApolloProvider>
  );
}

// For more details on `authContext`, `ProvideAuth`, `useAuth` and
// `useProvideAuth` refer to: https://usehooks.com/useAuth/

const authContext = createContext();

function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

function useAuth() {
  return useContext(authContext);
}

function useProvideAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return { user };
}

// A wrapper for <Route> that redirects to the login screen if you're not yet
// authenticated.
function PrivateRoute({ children, ...rest }) {
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
}

function PublicPage() {
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
  if (error) {
    console.error(error);
    return <p>Error :( {error.message}</p>;
  }
  return (
    <>
      <h3>Public</h3>
      <h4>Books:</h4>

      {data.books.map(({ title, author, id }) => (
        <div key={id}>
          <p>
            {title}: {author}
          </p>
        </div>
      ))}
    </>
  );
}

function ProtectedPage() {
  let history = useHistory();
  let auth = useAuth();
  return (
    <>
      <h3>Protected</h3>

      {auth.user && (
        <>
          <button
            onClick={() =>
              firebase
                .auth()
                .signOut()
                .then(client.resetStore())
                .finally(history.push("/"))
            }
          >
            Logout
          </button>
        </>
      )}
    </>
  );
}

function LoginPage() {
  let location = useLocation();
  let auth = useAuth();

  let { from } = location.state || { from: { pathname: "/" } };

  console.log(auth.user);

  return auth.user ? (
    <Redirect to={{ pathname: from.pathname }} />
  ) : (
    <div>
      <h2>Login</h2>
      <p>From: {from.pathname}</p>
      <StyledFirebaseAuth
        uiConfig={{
          callbacks: {
            // Avoid redirects after sign-in
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
}
