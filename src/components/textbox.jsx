import { useEffect, useState } from 'react'
import { io } from 'socket.io-client';





function TextBox({socket,roomName}){
  


  

  socket.on('initial',(data)=>{
    var editor = document.getElementById('editor');
    editor.value=data;
    console.log(data);

  })

socket.on('updateDoc',(data)=>{
  const editor = document.getElementById('editor');
  
  editor.value = data;

})

 function handleSelection  (event) {
    console.log(event)

  const editor = document.getElementById('editor');
//   if(event.key.length>=2 && event.key!=='Backspace' && event.key!=="Enter"){
//     return
//   }

  const obj={
    selectionStart : editor.selectionStart,
    selectionEnd : editor.selectionEnd,
    key:event.key,
    
  }
  console.log(obj)
  socket.emit('update',obj)

  


  
}

 

  return (
   <div className='flex w-[75vw]'  >
  
   
    <textarea onKeyDown={(event)=>handleSelection(event)} id="editor" rows="4" class="block p-2.5 w-full h-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>

   </div>
  )
}

export default TextBox;
