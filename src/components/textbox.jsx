import { useEffect, useState } from 'react'
import { io } from 'socket.io-client';





function TextBox({socket,roomId,setroomId}){
    // useEffect(() => {
    //     setroomId(idParam)
    //   }, [location]);
    document.addEventListener('DOMContentLoaded', () => {
        console.log(roomId)
        socket.emit('joinRoom',roomId);
    })

    // document.addEventListener('DOMContentLoaded', () => {
        // console.log("hello")
        useEffect(()=>{
            // console.log("hello");
            console.log(roomId,'gwegwegwe')
            socket.emit('joinRoom',roomId);
        },[roomId],[])
        
    //   });
  

  socket.on('initial',(data)=>{
    var editor = document.getElementById('editor');
    editor.value=data;
    console.log(data,'ini');

  })

socket.on('updateDoc',(data)=>{
    // console.log(data);
  const editor = document.getElementById('editor');
  
  editor.value = data;

})

 function handleSelection  (event) {
    

  const editor = document.getElementById('editor');
  if(event.key.length>=2 && event.key!=='Backspace' && event.key!=="Enter"){
    return;
  }

  const obj={
    selectionStart : editor.selectionStart,
    selectionEnd : editor.selectionEnd,
    key:event.key,
    roomId:roomId,
    
  }
  console.log(obj)
  socket.emit('update',obj)

  


  
}
function CursorPos(event){
    event.preventDefault()
    const textarea = document.getElementById("editor");
const cursorPosition = textarea.selectionStart;
// console.log("Cursor position:", cursorPosition);
   }

 

  return (
   <div className='flex w-[75vw]'  >
  
   
    <textarea onKeyDown={(event)=>handleSelection(event)} id="editor" rows="4" className="block resize-none p-2.5 w-full h-[100vh] text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>

   </div>
  )
}

export default TextBox;
