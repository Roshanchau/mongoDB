const express = require("express");
const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");

//init app & middleware

const app = express();

app.use(express.json());
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
  //current page
  //sends the page no if not sends 0 req.query.p is a query parameter.
  const page = req.query.p || 0;
  const booksPerPage = 3;
  let books = [];

  //we select the books collection of the mongoDB compass bookstore database
  db.collection("books")
    .find() //->it returns a curser which is a objec that has methods namely toArray and forEach which gives chunck of data which renews each time the older one gets exhausted
    .skip(page * booksPerPage)
    .limit(booksPerPage)
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

app.post("/books", (req, res) => {
  const book = req.body;

  db.collection("books")
    .insertOne(book)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ err: "could not create a new document." });
    });
});

app.delete("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "couldnot delete the document" });
      });
  } else {
    res.status(500).json({ error: "Not a vlid doc id" });
  }
});

app.patch("/books/:id", (req, res) => {
  const updates = req.body;

  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .updateOne({ _id: ObjectId(req.params.id) }, { $set: updates })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "couldnot update the document" });
      });
  } else {
    res.status(500).json({ error: "Not a vlid doc id" });
  }
});
