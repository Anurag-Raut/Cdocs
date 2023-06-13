import { useEffect, useState } from "react";
import SideComp from "./sideElement";
import axios from 'axios';
import { nanoid } from 'nanoid'
import { generateFromEmail, generateUsername } from "unique-username-generator";
var url='http://localhost:3000';
const randomusername = generateUsername("-");
function Sidebar({ setroomId }) {
    const [username,setUserName]=useState(randomusername);
  const [list, setList] = useState([]);
  console.log(list);
  async function getDocs() {
    try {
      const res = await axios.post(`${url}/getDocs`, {
       username: username ,
      });
      console.log(res);
      return res;
    } catch (error) {
      console.error('Error retrieving documents:', error);
      return null;
    }
  }
  async function delDoc(id) {
    try {
      const res = await axios.post(`${url}/deleteDoc`, {
       username: username ,
       id:id,
      });
      console.log(res);
      return res;
    } catch (error) {
      console.error('Error retrieving documents:', error);
      return null;
    }
  }
  useEffect(() => {
   
    async function fetchData() {
      const docs = await getDocs();
      setList([...docs.data])
      console.log(docs.data);
    }
    fetchData();
  }, []);


  async function handleSubmit(event) {
    event.preventDefault();
    let input1 = document.getElementById("roon-name");
    let val=input1.value;
    try {
      input1.value = "";
      
        await axios.post(`${url}/addDoc`, {
          username: username,
          id: nanoid(),
          name: val
        }).then(()=>{
            async function fetchData() {
                const docs = await getDocs();
                setList([...docs.data])
                console.log(docs.data);
              }
              fetchData();
              
        })
       

  
       
        
      } catch (error) {
        console.error('Error adding document:', error);
      
      }
   
  }

  const removeItemAtIndex = async (index) => {
    var d=await delDoc(list[index]._id)
    setList([...d.data]);
    console.log(list[index])

  };
  return (
    <div className="block w-[25vw]">
     
      <div
        id="default-sidebar"
        class="fixed top-0 left-0 z-40 w-[25vw] h-screen "
        aria-label="Sidebar"
      >
        <div class="h-full overflow-y-scroll no-scrollbar overflow-y-scroll flex flex-col justify-between  px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul class="space-y-2 font-medium">
            <form onSubmit={(e) => handleSubmit(e)}>
              <button className="w-full" type="submit">
                <div class="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <svg
                    aria-hidden="true"
                    class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                  </svg>
                  <span class="ml-3">Create new Room</span>
                </div>
                <div className="mt-2">
                  <input
                    type="text"
                    id="roon-name"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter room name"
                    required
                  />
                </div>
              </button>
            </form>

            {list.map((item, index) => {
              return (
                <SideComp
                  name={item.roomname}
                  index={index}
                  setroomId={setroomId}
                  removeItemAtIndex={removeItemAtIndex}
                  id={item._id}
                />
              );
            })}

          </ul>

          <div>
            <label class='text-gray-400'>username  :  <span class='text-white'>{username}</span></label>
            <input
            onChange={(e)=>{setUserName(e.target.value)}}
                    type="text"
                    id="roon-name"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter room name"
                    required
                  />
           
          </div>
        </div>
      </div>
    </div>
  );
}
export default Sidebar;
