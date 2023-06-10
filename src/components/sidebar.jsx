import { useState } from "react";
import SideComp from "./sideElement";

function Sidebar() {
   const [list,setList]=useState(['kjbjk']);
   console.log(list);
  return (
    <div className="block w-[25vw]">
      <div
        id="default-sidebar"
        class="fixed top-0 left-0 z-40 w-[25vw] h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul class="space-y-2 font-medium">
            <li onClick={()=>{var a = list ;
            a.push('hemlu');
                setList([...a])}}>
              <div class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
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
                <span class="ml-3">Add new Docs</span>
              </div>
            </li>
            {
                list.map((item)=>{
                    return(<SideComp  name={item} />)
                })
            }
            
          </ul>
        </div>
      </div>
    </div>
  );
}
export default Sidebar;
