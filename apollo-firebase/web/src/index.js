import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
// Apollo
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client";
// Components
import App from "./App";
// Firebase
import firebase from "./firebase";
// Hooks
import { AuthProvider } from "./hooks";

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

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  // defaultOptions: {
  //   mutate: { errorPolicy: "ignore" },
  // },
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <AuthProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </AuthProvider>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function to
// log results (for example: reportWebVitals(console.log)) or send to an
// analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
