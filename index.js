const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000 ;

// MiddleWare 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xdsq5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




async function run(){
  try{
    await client.connect();
    const database = client.db("travelHub");
    const packageCollection = database.collection("packages");
    console.log('connected with database');
    

    //GET API 
    app.get('/packages', async(req,res)=>{
      const cursor = packageCollection.find({});
      const packages = await cursor.toArray();
      res.send(packages);
    })

    // GET single API 
    app.get('/packages/:id', async(req,res)=>{
      const id = req.params.id;
      console.log('getting id',id);
      const query = {_id: ObjectId(id)};
      const package = await packageCollection.findOne(query);
      res.json(package);
    })

    // POST API 
    app.post('/packages', async(req,res)=>{
      const service = req.body ;
      console.log('hit the post api',service);

      const result = await packageCollection.insertOne(service);
      res.json(result);

      
    })

  }
  finally{
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})