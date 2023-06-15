const express = require("express");
const { Server } = require("socket.io");
const app = express();
const httpServer = require("http").createServer(app);
const dotenv = require("dotenv");
dotenv.config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const io = new Server({
  cors: {
    origin: true,
  },
});

io.listen(5000, {
  path: "/socket.io",
  serveClient: false,
  cookie: false,
  // ...
});

io.attach(httpServer, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    rejectUnauthorized: false,
    credentials: false,
  },
});

async function connection() {
  httpServer.listen(4000, () => {
    console.log("Server is running on port 4000");
  });
  const client = new MongoClient(process.env.URL, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  let db;

  await client.connect();
  db = await client.db("Cdocs");
  if (db) {
    console.log("hello");
  }

  return db;
}

async function main(db) {

  async function replaceString(str, start, end, newStr) {
    console.log(str);
    const prefix = str.substring(0, start);
    const suffix = str.substring(end);
    console.log(newStr);
    if (newStr === "Backspace") {
      return prefix.slice(0, -1) + suffix;
    }
    if (newStr === "Enter") {
      return prefix + "\n" + suffix;
    }
    return prefix + newStr + suffix;
  }

  io.on("connection", async (socket) => {
    socket.on("joinRoom", async (roomId) => {
      console.log(roomId);

      socket.join(roomId);
   
      await db
        .collection("Cdocs")
        .findOne({ _id: roomId })
        .then(async (oldDoc) => {
          console.log(oldDoc);

          if (!oldDoc?.val) {
            oldDoc = "";
          } else {
            oldDoc = oldDoc.val;
          }

          console.log(oldDoc);

          socket.emit("initial", oldDoc);
        });
    });
    socket.on("update", async (data) => {
      console.log("Received update:", data);
    
      socket.broadcast.to(data.roomId).emit("updateDoc", data);
      // }


   

      //     console.log(doc);
    });
    socket.on('db',async (data)=>{
          await db.collection("Cdocs").updateOne(
            { _id: data.roomId }, 
            { $set: { val: data.val } }, 
            { upsert: true } 
          )

    })

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
}
connection().then((db) => {

  main(db);
});

