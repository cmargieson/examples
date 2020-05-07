import { auth } from "../firebase";
import { AUTH_TYPES } from "./actionTypes";

export const verifyAuth = () => {
  return (dispatch) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // Signed in
        dispatch({
          type: AUTH_TYPES.AUTH_USER,
          payload: {
            userModel: user,
          },
        });
      } else {
        // Not signed in
        dispatch(signOut());
      }
    });
  };
};

// Create a new user in firebase with email and password
export const createUserWithEmailAndPassword = (email, password) => {
  return (dispatch) => {
    auth.createUserWithEmailAndPassword(email, password).then(() => {
      dispatch(verifyAuth());
    });
  };
};

// Sign in a user with email and password
export const signInWithEmailAndPassword = (email, password) => {
  return (dispatch) => {
    auth.signInWithEmailAndPassword(email, password).then(() => {
      dispatch(verifyAuth());
    });
  };
};

// Sign out a user
export const signOut = () => {
  return (dispatch) => {
    auth.signOut().then(() => {
      dispatch({
        type: AUTH_TYPES.AUTH_LOGOUT,
      });
    });
  };
};
