const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://hennelflori:random123@cluster0.jqiuyf8.mongodb.net/discord_clone";

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
