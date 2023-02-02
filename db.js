const { MongoClient } = require("mongodb");

let dbConnection;
let uri =
  "mongodb+srv://Roshan11:test1320@noderoshan.a8gbrsg.mongodb.net/?retryWrites=true&w=majority";
module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(uri)
      .then((client) => {
        dbConnection = client.db();
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};
