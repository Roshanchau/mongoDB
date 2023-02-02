const express = require("express");
const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");

//init app & middleware

const app = express();

//db connection
//connect to db takes a call back function as an arguement.
let db;
connectToDb((err) => {
  if (!err) {
    app.listen(2000, () => {
      console.log("listening to port 2000");
    });
    db = getDb();
  }
});

//routes
app.get("/books", (req, res) => {
  let books = [];

  //we select the books collection of the mongoDB compass bookstore database
  db.collection("books")
    .find() //->it returns a curser which is a objec that has methods namely toArray and forEach which gives chunck of data which renews each time the older one gets exhausted
    .sort({ author: 1 }) //sorts  by author name in ascending order a-z
    .forEach((book) => books.push(book)) //pushes each book in the books empty array since this takes some time it is asynchronous so we are able to use the .then method
    .then(() => {
      res.status(200).json(books);
    })
    .catch(() => {
      res.status(500).json({ error: "could not fetch the document." });
    });

  // res.json({ mssg: "connected to the api" });
});

app.get("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .findOne({ _id: ObjectId(req.params.id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ error: "couldnot fetch the document" });
      });
  } else {
    res.status(500).json({ error: "Not a vlid doc id" });
  }
});
