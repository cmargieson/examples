const DataLoader = require("dataloader");
const admin = require("firebase-admin");

const getAll = async (type) => {
  let result = [];

  try {
    const ref = admin.firestore().collection(type);
    const snapshot = await ref.get();

    if (!snapshot.empty) {
      result = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
  } catch (error) {
    console.log(error);
  }

  return result;
};

const getOne = async (type, id) => {
  let result = {};

  try {
    const ref = admin.firestore().collection(type).doc(id);
    const doc = await ref.get();

    if (doc.exists) {
      result = { id: doc.id, ...doc.data() };
    }
  } catch (error) {
    console.log(error);
  }

  return result;
};

const loader = new DataLoader((keys) =>
  Promise.all(keys.map((key) => getOne(key.type, key.id)))
);

const batchLoad = (ids, type) =>
  loader.loadMany(ids.map((id) => ({ id, type })));

module.exports = { getAll, getOne, batchLoad };
