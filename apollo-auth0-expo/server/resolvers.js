module.exports = {
  Query: {
    user: (parent, args, { dataSources }, info) =>
      dataSources.userAPI.retrieveUser(),
  },

  Mutation: {
    createCollection: async (parent, args, { dataSources, db }, info) => {
    //   // Get user id
    //   const user = await dataSources.userAPI.retrieveUser();

    //   if (user?.sub) {
    //     // Insert the document
    //     const result = await db
    //       .collection("collections")
    //       .insertOne({ user: user.sub, ...args });

    //     // Find the inserted document
    //     return await db
    //       .collection("collections")
    //       .findOne({ _id: result.insertedId });
    //   }

    //   // throw new AuthenticationError();
    },
  },

  // Types
  Collection: {
    id: (parent, args, context, info) => parent.id || parent._id || parent.sub,
  },
  User: {
    id: (parent, args, context, info) => parent.id || parent._id || parent.sub,
  },
};
