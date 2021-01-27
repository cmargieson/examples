// Cloud Functions for Firebase SDK
const functions = require("firebase-functions");

// Firebase Admin SDK
const admin = require("firebase-admin");
admin.initializeApp();

const { ApolloServer, gql } = require("apollo-server-cloud-functions");

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
    books: async (parent, args, context, info) => {
      console.log(context);

      if (!context.user?.uid) return [];

      const snapshot = await admin
        .firestore()
        .collection("books")
        .where("uid", "==", context.user.uid)
        .get();

      let walks = [];
      snapshot.docs.map((doc) => walks.push({ id: doc.id, ...doc.data() }));
      return walks;
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
    return { user: null };
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
