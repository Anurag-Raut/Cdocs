import express from  'express';
import { Server } from "socket.io";

const io = new Server({
    cors: {
      origin: "*"
    }
  });
  
  io.listen(4000);
  var doc='';
  function replaceString(str, start, end, newStr) {
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


io.on('connection',(socket)=>{
    // console.log('Hello')
    socket.on('ready',()=>{
        console.log(doc)
        socket.emit('initial',doc)
    })
    
    socket.on('hello',()=>{
        socket.emit('reply','hi')
    })
    socket.on('update', (data) => {
        
        console.log('Received update:', data);
        doc=replaceString(doc,data.selectionStart,data.selectionEnd,data.key)
            // do
            // doc+=data.key
            console.log(doc);
        // Emit the update to all connected clients
        socket.broadcast.emit('updateDoc', doc);
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
   
})



