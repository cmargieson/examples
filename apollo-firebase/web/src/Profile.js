import React from "react";
// Firebase
import firebase from "./firebase";
// Hooks
import { useAuth } from "./hooks";
// Router
import { useHistory } from "react-router-dom";

const ProfilePage = ({ cb }) => {
  let history = useHistory();
  let auth = useAuth();

  return (
    <>
      <h3>Profile:</h3>

      {auth.user && (
        <>
          <p>{auth.user.email}</p>
          <button
            onClick={() =>
              firebase.auth().signOut().then(history.push("/")).finally(cb())
            }
          >
            Logout
          </button>
        </>
      )}
    </>
  );
};

export default ProfilePage;
