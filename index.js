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
    const purchasingCollection = database.collection("purchasing_Info");
    const userCollection = database.collection("users");
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


    // Get Single Car Info to display on UI
    app.get('/car/:carId', async(req,res)=>{
      const id = req.params.carId;
      const query = {_id: ObjectId(id)}
      const result = await carCollection.findOne(query);
      res.json(result)
    });



    // Get My Order Info to display on UI
    app.get('/myOrder', async(req,res)=>{
      const email = req.query.email;
      const query = {email}
      const result = await purchasingCollection.find(query).toArray();
      res.json(result)
    });


    // Get My Order Info to display on UI
    app.get('/allOrder', async(req,res)=>{
      const result = await purchasingCollection.find({}).toArray();
      res.json(result)
    });


    // Get Single Car Info to display on UI
    app.post('/purchasingInfo', async(req,res)=>{
      const data = req.body;
      const result = await purchasingCollection.insertOne(data);
      res.json(result.acknowledged)
    });

    // Store Logged in User Data
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      console.log(result)
      res.json(result.acknowledged)
    });

     // Find Clicked Car to delete from Order
     app.delete('/deleteOrder/:orderId', async(req,res)=>{
      const id = req.params.orderId;
      const query = {_id: ObjectId(id)}
      const result = await purchasingCollection.deleteOne(query);
      res.json(result.acknowledged)
    });

    app.put('/status/:id', async (req, res) => {
      const id = req.params.id;
      const updatedInfo = req.body;
      const result = await purchasingCollection.updateOne({_id:ObjectId(id)},{
        $set:{
          status : updatedInfo.status
        },
      });
      console.log(result)
      res.json(result.acknowledged);
    });

    // Google user can logged in before so we use upsert method here
    app.put('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const options = { upsert: true }
      const updateUser = { $set: user };
      const result = await userCollection.updateOne(query, updateUser, options)
      res.send(result.acknowledged)
    });

    // Make admin
    app.put('/user/admin', async (req, res) => {
      const user = req.body.email;
      const query = { email: user };
      const updateUser = { $set: {role:'Admin'}};
      const result = await userCollection.updateOne(query, updateUser);
      res.json(result)
    });

    // check admin or not
    app.get('/user/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email }
      const user = await userCollection.findOne(query);
      let isAdmin = false
      if (user?.role === 'Admin') {
        isAdmin = true
      };
      res.json({ admin: isAdmin })
    })

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