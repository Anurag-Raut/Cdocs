const express =  require('express');
const { Server } = require("socket.io");
const app=express();
const httpServer = require("http").createServer(app);
const dotenv =require('dotenv');
dotenv.config();
const  { MongoClient, ServerApiVersion } = require('mongodb');

const io = new Server({
    cors: {
      origin: "*"
    }
  });
  
  io.listen(5000, { 
    path: "/socket.io",
    serveClient: false,
    cookie: false,
    // ...
  });

  io.attach(httpServer, {
    cors: {
      origin: "https://cdocs.onrender.com",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });
  
  async function connection(){
    const client = new MongoClient(process.env.URL, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
      let db;
  
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    db= await client.db("Cdocs")
    if(db){
        console.log("hello")
    }

    return db;
  }
  httpServer.listen(4000, () => {
    console.log("Server is running on port 4000");
  });

  
  async function main(db){
    // console.log(db)

    
    


    async function replaceString(str, start, end, newStr) {
      console.log(str)
      const prefix = str.substring(0, start);
      const suffix = str.substring(end);
      console.log(newStr);
      if(newStr==="Backspace"){
          // prefix.pop();
          return prefix.slice(0,-1)+suffix
      }
      if(newStr==="Enter"){
          return prefix + '\n' + suffix;
      }
      return prefix + newStr + suffix;
    }
  
  
  io.on('connection', (socket)=>{
      // console.log('Hello')
      socket.on('joinRoom', async (roomId) => {
          // Join the specified room
          console.log(roomId);
          socket.join(roomId);
          console.log("he")
          await db.collection('Cdocs').findOne({ _id: roomId })
          .then(async (oldDoc)=>{
            console.log(oldDoc)

            if(!oldDoc?.val){
               
                    
                      oldDoc='';
                   
                  }
                  else{
                    oldDoc=oldDoc.val
                  }

                  console.log(oldDoc)
          
         
          socket.emit('initial',oldDoc)
            
      })
    })
    socket.on('update', async (data) => {

          
        console.log('Received update:', data);
        await db.collection('Cdocs').findOne({ _id: data.roomId })
        .then(async (oldDoc)=>{

          if(!oldDoc){
            //   console.log(oldDoc.val,'olddoc')d
                  
                    oldDoc='';
                 
                }
                else{
                  oldDoc=oldDoc.val
                }
                console.log(oldDoc);
            var newDoc=await replaceString(oldDoc,data.selectionStart,data.selectionEnd,data.key)
            console.log(newDoc,'newdocc')
            await db.collection('Cdocs').updateOne(
                { _id: data.roomId },  // Match the object based on the unique identifier
                { $set: {val:newDoc} }, // Set the fields with the new data
                { upsert: true }      // Enable upsert to add if not present
              );
              socket.to(data.roomId).emit('updateDoc', newDoc);
        })
        
       
        //     console.log(doc);

            
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
     
      
     
     
     
  })
  




  }
connection().then((db)=>{
    // console.log(db);
    main(db)
})
//  main(db)
  


