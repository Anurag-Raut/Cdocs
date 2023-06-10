import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv'
import cors from 'cors';
dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors())

// Assuming you have a MongoDB connection URL
const MONGODB_URI = process.env.URL

// Create a new MongoClient instance
const client = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Connect to MongoDB
client.connect()
  .then(() => {
    console.log('Connected to MongoDB');

    // Define the '/chats' route
    app.post('/getDocs', async (req, res) => {
      try {
        const { username } = req.body;
        console.log(username)
        if(!username){
            res.status(500).json({ error: 'An error occurred' });
            return
        }
        console.log('hello');

        // Get the database and collection
        const database = client.db('Cdocs');
        const collection = database.collection('Cdocs');

        const query = { username: username };
        const documents = await collection.find(query).toArray();
        res.json(documents);
      } catch (error) {
        console.error('Error retrieving documents:', error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });
    app.post('/addDoc',async (req,res)=>{
        try
        {
            console.log('hello')
            const { username,id,name } = req.body;
        const database = client.db('Cdocs');
        const collection = database.collection('Cdocs');
        const obj = { username: username, _id:id,roomname:name,val:'' };
        console.log(obj)
        await collection.insertOne(obj);
        res.status(200).json({ message: 'user added' });

        }
        catch (error) {
            console.error('Error upserting document:', error);
            res.status(500).json({ error: 'An error occurred' });
          }
        


    })
    app.post('/deleteDoc', async (req, res) => {
        try {
          const { id,username } = req.body;
          console.log(id,username);
  
          // Get the database and collection
          const database = client.db('Cdocs');
          const collection = database.collection('Cdocs');
  
          const query = { _id: id };
          const result = await collection.deleteOne(query);
  
          if (result.deletedCount === 1) {
            const query2 = { username: username };
        const documents = await collection.find(query2).toArray();
        res.json(documents);
          } else {
            res.status(404).json({ error: 'Document not found' });
          }
        } catch (error) {
          console.error('Error deleting document:', error);
          res.status(500).json({ error: 'An error occurred' });
        }
      });
  

    // Start the server
    app.listen(3000, () => {
      console.log('Server started on port 3000');
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
