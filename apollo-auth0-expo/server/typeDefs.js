const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    id: ID
    nickname: String
    name: String
    picture: String
    updated_at: String
    email: String
    email_verified: String
  }

  type Collection {
    id: ID
    name: String
    user: String
  }

  type Query {
    user: User
  }

  type Mutation {
    createCollection(name: String): Collection
  }
`;
