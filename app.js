const express = require("express");
const { connectToDb, getDb } = require("./db");

//init app & middleware

const app = express();

//db connection
//connect to db takes a call back function as an arguement.
let db;
connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("listening to port 3000");
    });
    db = getDb();
  }
});

//routes
app.get("/books", (req, res) => {
  res.json({ mssg: "welcome to the api" });
});
