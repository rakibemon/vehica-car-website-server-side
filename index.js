const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();



// Middelware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xrjhi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    
    const database = client.db("Vehica");
    const carCollection = database.collection("Cars");
    const reviewCollection = database.collection("Reviews");
    const qualityCollection = database.collection("Quality");
    // Get All Cars to display on UI
    app.get('/explorecars', async(req,res)=>{
      const result = await carCollection.find({}).toArray();
      res.json(result)
    });

    // Get All Reviews to display on UI
    app.get('/review', async(req,res)=>{
      const result = await reviewCollection.find({}).toArray();
      res.json(result)
    });


    // Get All Qualities to display on UI
    app.get('/quality', async(req,res)=>{
      const result = await qualityCollection.find({}).toArray();
      res.json(result)
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("I am now in Vehica Server")
  });
app.listen(port, () => {
    console.log("Vehica listening at port ", port);
  
  })