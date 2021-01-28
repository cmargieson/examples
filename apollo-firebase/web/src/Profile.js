import React, { useState } from "react";
// Apollo
import { useMutation, useQuery, gql } from "@apollo/client";
// Firebase
import firebase from "./firebase";
// Hooks
import { useAuth } from "./hooks";
// Mutations
import { NEW_BOOK, BOOKS } from "./mutations";
// Router
import { useHistory } from "react-router-dom";

const ProfilePage = ({ cb }) => {
  let history = useHistory();
  let auth = useAuth();

  const [newBook, result] = useMutation(NEW_BOOK, {
    onError(error) {
      console.error("error :", error.message);
    },
  });

  const [title, setTitle] = useState();
  const [author, setAuthor] = useState();

  return (
    <div>
      <h1>Profile: {auth.user.email}</h1>

      <button
        onClick={() =>
          firebase.auth().signOut().then(history.push("/")).finally(cb())
        }
      >
        Logout
      </button>

      <h2>Add Book:</h2>

      {result.loading && <p>Adding new book</p>}

      {result.data && <p>Added book: {result.data.newBook.id}</p>}

      <form
        onSubmit={(event) => {
          event.preventDefault();

          newBook({
            variables: { title, author },
            refetchQueries: [{ query: BOOKS }],
          });

          setTitle("");
          setAuthor("");
        }}
      >
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>

        <label>
          Author:
          <input
            type="text"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />
        </label>

        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default ProfilePage;
