import {Link} from 'react-router-dom';
function SideComp({name,index,removeItemAtIndex,setroomId,id}){
    return (
        <Link to={`/?id=${id}`} className="flex justify-between items-center  hover:bg-gray-100 dark:hover:bg-gray-700  rounded-lg dark:text-white  " onClick={()=>setroomId(name)}>
        <div  class="flex  w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
           <svg aria-hidden="true" className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
           <span class="ml-3">{name}</span>
           
           

        </div>
        <button className="text-red-600 mr-2 " onClick={()=>removeItemAtIndex(index)}>
            delete
        </button>
       
     </Link>
    );
}
export default SideComp;