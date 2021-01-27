import React, { createContext, useContext, useEffect, useState } from "react";
// Firebase
import firebase from "./firebase";

const authContext = createContext();

export const AuthProvider = ({ children }) => {
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

export const useAuth = () => useContext(authContext);
