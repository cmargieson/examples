import React from "react";
// Apollo
import { gql, useQuery } from "@apollo/client";
// Mutations
import { BOOKS } from "./mutations";

const HomePage = () => {
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

export default HomePage;
