import { useEffect, useState } from 'react'
import { io } from 'socket.io-client';
import TextBox from './components/textbox';
import Sidebar from './components/sidebar';
import { useLocation } from 'react-router-dom';
import dotenv from 'dotenv'
dotenv.config();




const socket = io(`https://cdocs-socket-server.onrender.com`);







function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get('id');
  const [roomId,setroomId]=useState(idParam);
  let location=useLocation()
  useEffect(() => {
    console.log('pleaseee upfat')
    setroomId(idParam)
  }, [location]);

  // setroomId(idParam)
// console.log(roomId);
  return (
   <div className='flex w-[100vw]'>
    <Sidebar roomId={roomId} setroomId={setroomId} />
      <TextBox socket={socket} roomId={roomId} setroomId={setroomId} />
   </div>
  )
}

export default App;
