import { useEffect, useState } from 'react'
import { io } from 'socket.io-client';
import TextBox from './components/textbox';
import Sidebar from './components/sidebar';


const socket = io('http://localhost:4000');







function App() {
  const [roomId,setroomId]=useState('room1')
console.log(roomId);
  return (
   <div className='flex w-[100vw]'>
    <Sidebar roomId={roomId} setroomId={setroomId} />
      <TextBox socket={socket} roomId={roomId} setroomId={setroomId} />
   </div>
  )
}

export default App;
