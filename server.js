const express = require("express");
const { MongoClient, ObjectID } = require("mongodb");
const assert = require("assert");



const app = express();

app.use(express.json());
const mongo_url = "mongodb://localhost:27017";
const dataBase = "contacts"


MongoClient.connect(mongo_url, { useUnifiedTopology: true }, (err, client) => {
  assert.equal(err, null, "data base connexion failed");
  const db = client.db(dataBase);

  app.post("/addcontact", (req, res) => {
    let newContact = req.body;
    db.collection("contactlist").insertOne(newContact, (err, data) => {
      if (err) res.send("cant not add new contact");
      else res.send("new contact added");
    });
  });

  app.get("/contacts", (req, res) => {
    db.collection("contactlist")
      .find()
      .toArray((err, data) => {
        if (err) res.send("cant not get contacts list");
        else res.send(data);
      });
  });

  app.get("/contact/:id", (req, res) => {
    db.collection("contactlist").findOne(
      { _id: ObjectID(req.params.id) },
      (err, data) => {
        if (err) res.send("cant not get contact");
        else res.send(data);
      }
    );
    
  });

  app.delete("/deletecontact/:id", (req, res) => {
    db.collection("contactlist").findOneAndDelete(
      { _id: ObjectID(req.params.id) },
      (err, data) => {
        if (err) res.send("cant delete the contact");
        else res.send("contact was deleted");
      }
    );
  });

  app.put("/updatecontact/:id", (req, res) => {
    db.collection("contactlist").findOneAndUpdate(
      { _id: ObjectID(req.params.id) },
      { $set: { ...req.body } },
      (err, data) => {
        if (err) res.send("cant modify contact");
        else res.send("contact was modified");
      }
    );
  });
});



const port = process.env.PORT || 7000;
app.listen(port, err => {
  if (err) console.log("server is not running");
  else console.log(`server is running on port ${port}`);
});
