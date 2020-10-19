const { ApolloServer } = require("apollo-server");
// const { MongoClient } = require("mongodb");

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

// Data sources
const UserAPI = require("./datasources/user");

// const MONGO_USERNAME = "";
// const MONGO_PASSWORD = "";
// const MONGO_DBNAME = "";

// const mongoURI = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.mohn6.mongodb.net/${MONGO_DBNAME}?retryWrites=true&w=majority`;
// const mongoOptions = { useUnifiedTopology: true };

// mongoClient = MongoClient(mongoURI, mongoOptions);

// const connectWithRetry = async () => {
//   try {
//     await mongoClient.connect();
//     console.log(`Connected to database: ${MONGO_DBNAME}`);
//   } catch (error) {
//     setTimeout(connectWithRetry, 10000);
//     console.error(`Database connection error: ${error}`);
//   }
// };
// connectWithRetry();

const server = new ApolloServer({
  typeDefs,
  resolvers,

  dataSources: () => ({
    userAPI: new UserAPI(),
  }),

  context: async ({ req }) => {
    const authorization = req.headers?.authorization;
    //const db = mongoClient.db();

    return {
      authorization,
      //db
    };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
