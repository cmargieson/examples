import React from "react";
// Apollo
import { client } from "./index.js";
// Firebase
import firebase from "./firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
// Hooks
import { useAuth } from "./hooks";
// Router
import { Redirect, useLocation } from "react-router-dom";

const LoginPage = () => {
  let location = useLocation();
  let auth = useAuth();

  let { from } = location.state || { from: { pathname: "/" } };

  if (auth.loading) return <h1>Loading...</h1>;

  return auth.user ? (
    <Redirect to={{ pathname: from.pathname }} />
  ) : (
    <div>
      <p>Login</p>

      <p>From: {from.pathname}</p>

      <StyledFirebaseAuth
        uiConfig={{
          callbacks: {
            signInSuccessWithAuthResult: () => {
              client.resetStore();
              return false;
            },
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

export default LoginPage;
