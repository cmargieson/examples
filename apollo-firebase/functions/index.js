// Cloud Functions for Firebase SDK
const functions = require("firebase-functions");

// Firebase Admin SDK
const admin = require("firebase-admin");
admin.initializeApp();

const { ApolloServer, gql } = require("apollo-server-cloud-functions");

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
    id: "1aqa3",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
    id: "8ythero",
  },
];

const typeDefs = gql`
  type Book {
    title: String
    author: String
    id: ID
  }

  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    books: (parent, args, context, info) => {
      console.log(context);
      return books;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    // Get token from  headers
    const token = req.headers?.authorization;

    if (token) {
      try {
        // Verify token and get user
        const user = await admin
          .auth()
          .verifyIdToken(req.headers.authorization);
        // Add user to  context
        return { user };
      } catch (e) {
        // console.log(e);
        return { user: null };
      }
    }
  },
  playground: true,
  introspection: true,
});

const handler = server.createHandler({
  cors: {
    origin: true,
    credentials: true,
  },
});

exports.graphql = functions.https.onRequest(handler);
