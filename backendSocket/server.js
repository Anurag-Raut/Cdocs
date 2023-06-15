const express = require("express");
const { Server } = require("socket.io");
const app = express();
const httpServer = require("http").createServer(app);
const dotenv = require("dotenv");
dotenv.config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const io = new Server(httpServer, {
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

  const router = express.Router();

  router.post("/update", async (req, res) => {
    try {
      const { roomId, data } = req.body;
      console.log("Received update:", data);

      io.to(roomId).emit("updateDoc", data);

      await db.collection("Cdocs").updateOne(
        { _id: roomId },
        { $set: { val: data } },
        { upsert: true }
      );

      res.status(200).json({ message: "Update sent successfully" });
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ error: "An error occurred" });
    }
  });

  app.use("/socket", router);

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

    socket.on("db", async (data) => {
      await db.collection("Cdocs").updateOne(
        { _id: data.roomId },
        { $set: { val: data.val } },
        { upsert: true }
      );
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
}

connection().then((db) => {
  main(db);
});
