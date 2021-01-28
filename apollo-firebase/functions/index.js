// Cloud Functions for Firebase SDK
const functions = require("firebase-functions");

// Firebase Admin SDK
const admin = require("firebase-admin");
admin.initializeApp();

const {
  ApolloServer,
  gql,
  AuthenticationError,
} = require("apollo-server-cloud-functions");

const typeDefs = gql`
  type Book {
    title: String
    author: String
    id: ID
  }

  type Query {
    books: [Book]
    book(id: ID!): Book
  }

  type Mutation {
    newBook(input: BookInput): Book
  }

  input BookInput {
    title: String
    author: String
  }
`;

const resolvers = {
  Query: {
    books: async (parent, args, context, info) => {
      if (!context.user?.uid) return [];

      const snapshot = await admin
        .firestore()
        .collection("books")
        .where("uid", "==", context.user.uid)
        .get();

      let books = [];
      snapshot.docs.map((doc) => books.push({ id: doc.id, ...doc.data() }));
      return books;
    },

    book: async (parent, args, context) => {
      const doc = await admin
        .firestore()
        .collection("books")
        .doc(args.id)
        .get();

      if (doc.exists) {
       
        return { id: doc.id, ...doc.data() };
      }

      return; // TODO: error
    },
  },

  Mutation: {
    newBook: async (parent, args, context) => {
      if (!context.user) {
        return new AuthenticationError("you must be logged in");
      }

      const newBook = {
        ...args.input,
        uid: context.user.uid,
      };

      const res = await admin.firestore().collection("books").add(newBook);

      const doc = await admin.firestore().collection("books").doc(res.id).get();

      if (doc.exists) {
        console.log({ id: doc.id, ...doc.data() })
        return { id: doc.id, ...doc.data() };
      }

      return; // TODO: error
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
