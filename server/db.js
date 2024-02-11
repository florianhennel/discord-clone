const { MongoClient } = require("mongodb");
require('dotenv').config();
const uri = process.env.MONGODB_URI;

let dbConnection;
module.exports = {
  connectToDb: async (cb) => {
    await MongoClient.connect(uri)
      .then((client) => {
        dbConnection = client.db();
        return cb();
      })
      .catch((err) => {
        console.error(err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};
