import { useEffect, useState } from 'react'
import { io } from 'socket.io-client';
import dotenv from 'dotenv'
dotenv.config();
const socket = io(`http://127.0.0.1:4000/socket`);

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};



socket.on('initial',async (data)=>{
var editor = document.getElementById('editor');
editor.value=data;


})


socket.on('updateDoc',async (data)=>{

function replaceString(str, start, end, newStr) {
if(!str){
str=''
}
console.log(str,start,end,newStr);
const prefix = str.substring(0, start);
const suffix = str.substring(end);

if (newStr === "Backspace") {
// prefix.pop();
return prefix.slice(0, -1) + suffix;
}
if (newStr === "Enter") {
return prefix + "\n" + suffix;
}
return prefix + newStr + suffix;
}

// console.log("hemliu pleaeses",data);
// console.log(data);
const editor = document.getElementById('editor');


var newstr=   replaceString(editor.value,
data.selectionStart,
 data.selectionEnd,
  data.key)
editor.value = newstr;

})



function TextBox({roomId,setroomId}){

  const handleValueChange = debounce(() => {
    console.log('debouncee');
    const editor = document?.getElementById('editor');
    socket.emit('db',{val:editor.value,roomId:roomId})
  }, 1000); 
  




  useEffect(()=>{
  
    socket.emit('joinRoom',roomId);
},[roomId],[])

function handleSelection  (event) {
  


  const editor = document.getElementById('editor');
  editor?.addEventListener('input', handleValueChange);
  if(event.key.length>=2 && event.key!=='Backspace' && event.key!=="Enter"){
  return;
  }
  
  const obj={
  selectionStart : editor.selectionStart,
  selectionEnd : editor.selectionEnd,
  key:event.key ,
  roomId:roomId ,
  
  }
  console.log(obj)
  
  socket.emit('update',obj)
  
  
  
  
  
  }

  
  
  
 

  return (
   <div className='flex w-[75vw]'  >
  
   
    <textarea onKeyDown={(e)=>{handleSelection(e)}} id="editor" rows="4" className="block resize-none p-2.5 w-full h-[100vh] text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your content here..."></textarea>

   </div>
  )
}

export default TextBox;
