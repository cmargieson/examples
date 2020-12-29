import React from "react";
import { Text } from "react-native";
// Apollo
import { useQuery, gql } from "@apollo/client";

const BOOKS = gql`
  query Books {
    books {
      title
      author
    }
  }
`;

const Books = () => {
  const { loading, error, data } = useQuery(BOOKS);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error.message}</Text>;

  return data.books.map((book, i) => (
    <Text key={i}>
      {book.title} - {book.author}
    </Text>
  ));
};

export default Books;
