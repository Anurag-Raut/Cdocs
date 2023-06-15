const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());

const MONGODB_URI = process.env.URL;

const client = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ hello: 'hello' });
});

router.post('/getDocs', async (req, res) => {
  try {
 
    const { username } = req.body;
    console.log(username)
    if (!username) {
      res.status(500).json({ error: 'An error occurred' });
      return;
    }

    const database = client.db('Cdocs');
    const collection = database.collection('Cdocs');

    const query = { username };
    const documents = await collection.find(query).toArray();
    res.json(documents);
  } catch (error) {
    console.error('Error retrieving documents:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.post('/addDoc', async (req, res) => {
  try {
    const { username, id, name } = req.body;
    const database = client.db('Cdocs');
    const collection = database.collection('Cdocs');
    const obj = { username, _id: id, roomname: name, val: '' };

    await collection.insertOne(obj);
    res.status(200).json({ message: 'User added' });
  } catch (error) {
    console.error('Error upserting document:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.post('/deleteDoc', async (req, res) => {
  try {
    const { id, username } = req.body;
    const database = client.db('Cdocs');
    const collection = database.collection('Cdocs');
    const query = { _id: id };

    const result = await collection.deleteOne(query);

    if (result.deletedCount === 1) {
      const query2 = { username };
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

// Mount the router under the /mongo path
app.use('/mongo', router);

client.connect()
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
      console.log('Server started on port 3000');
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
