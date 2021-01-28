// Apollo
import { useMutation, useQuery, gql } from "@apollo/client";

export const BOOKS = gql`
  query books {
    books {
      title
      author
      id
    }
  }
`;

export const NEW_BOOK = gql`
  mutation newBook($title: String!, $author: String!) {
    newBook(input: { title: $title, author: $author }) {
      id
      title
      author
    }
  }
`;
