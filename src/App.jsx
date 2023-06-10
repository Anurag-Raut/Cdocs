import { useEffect, useState } from 'react'
import { io } from 'socket.io-client';
import TextBox from './components/textbox';
import Sidebar from './components/sidebar';


const socket = io('http://localhost:4000');


document.addEventListener('DOMContentLoaded', () => {
  console.log("hello")
  socket.emit('ready');
});



function App() {
  

  return (
   <div className='flex w-[100vw]'>
    <Sidebar/>
      <TextBox socket={socket}/>
   </div>
  )
}

export default App;
