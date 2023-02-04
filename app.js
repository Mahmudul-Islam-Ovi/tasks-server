const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.imuxo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
   try {
      const dataCollection = client.db("tasks").collection("data");

      // insert data
      app.post('/information', async (req, res) => {
         const user = req.body;
         const result = await dataCollection.insertOne(user);
         res.send(result);
      });

      // get data 

      app.get('/information', async (req, res) => {
         const query = {};
         const cursor = dataCollection.find(query);
         const information = await cursor.toArray();
         res.send(information);
      });

      // get single data
      app.get('/information/:id', async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) };
         const result = await dataCollection.findOne(query);
         res.send(result);

      });

      //delete data 

      app.delete('/information/:id', async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) }
         const result = await dataCollection.deleteOne(query);
         res.send(result);
      });

      //update data 
      app.put('/information/:id', async (req, res) => {
         const id = req.params.id;
         const filter = { _id: new ObjectId(id) }
         const user = req.body;
         const option = {upsert: true};
         const updatedUser = {
            $set: {
               name : user.name,
               select : user.select
            }
         }

         const result = await dataCollection.updateOne(filter, updatedUser, option);
         res.send(result);
      });



   } finally {
      // await client.close();
   }
}
run().catch(console.dir);


// welcome server 
app.get("/", (req, res) => {
   res.send('Server is listening');
});






// Server error
app.use((err, req, res, next) => {
   res.status(500).json({ message: "Server not found" })
});

module.exports = app;