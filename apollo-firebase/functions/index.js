// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
    id: "1aqa3"
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
    id: "8ythero"
  },
];

const {
  ApolloServer,
  gql,
  AuthenticationError,
} = require("apollo-server-cloud-functions");

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
    id: ID
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // context: async ({ req }) => {
  //   // Get the user token from the headers
  //   const token = req.headers?.authorization;

  //   if (token) {
  //     // Verify the token and get the user
  //     const user = await admin.auth().verifyIdToken(req.headers.authorization);
  //     // Add the user to the context
  //     return { user };
  //   }
  // },
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
