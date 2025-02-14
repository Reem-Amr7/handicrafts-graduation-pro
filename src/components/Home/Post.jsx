import styles from './Home.module.css';
import user1 from '../../assets/user1.jpg';
import post1 from '../../assets/p1.jpg';
import { FaHeart, FaShareAlt, FaComment, FaEye, FaRedo  } from "react-icons/fa";


export default function (){
    return(
        <>
         <div className={`p-5 min-h-96  mt-5 ${styles.leftside}`}>
           <div className="flex">
           <img src={user1} alt="منتج تقليدي" className="w-12 h-12 border-2 border-red-900 rounded-full" />
           <p> user name</p>
           {/* <MoreHorizontal className="w-6 h-6 text-gray-600" /> */}
           </div>
           <div className='w-100 h-96 rounded-md mt-4'>
           <img className='w-full h-full ' src={post1}/>
           </div>
           <div>
             <h2>اوانى خزف</h2>
             <p className="border-b-2 border-black block mt-2 p-3">
      inku" عبارة عن مجموعة تطبيقات جوال للمجتمع الاجتماعي مع ميزات...
    </p>   
    <div className="flex justify-between mt-5"	>

    <div className="flex items-center  justify-between  gap-11 text-red-900 mt-4">
      
      <div className="flex items-center  right-1 gap-1 relative">
        <span className='absolute bottom-4 left-1 text-xs text-black	'>100</span>        <FaHeart />

      </div>
      <div className="flex items-center gap-1 relative right-1">
        <span className='absolute bottom-4 left-1 text-xs text-black	'>50</span>         <FaShareAlt />

      </div>
      <div className="flex items-center gap-1 relative right-1">
        <span className='absolute bottom-4 left-1 text-xs text-black	'>100</span>         <FaComment />

      </div>
      <div className="flex items-center gap-1 relative right-1">
        <span className='absolute bottom-4 left-1 text-xs text-black	'>205</span>         <FaEye />

      </div>
    </div>

      <div className="flex items-center gap-1  text-red-900">
        <span>إعادة نشر</span>        <FaRedo />

      </div>
    </div>

    <div className="border border-[#b68d5a] rounded-lg p-4 w-full mt-5 ">
      <textarea
        className="w-full border-none focus:outline-none text-gray-500 resize-none"
        rows="3"
        placeholder="Post a comment..."
      ></textarea>
      <hr className="border-[#b68d5a] my-2" />
      <div className="flex items-center justify-between">
        <img
          src="https://randomuser.me/api/portraits/women/1.jpg"
          alt="User Avatar"
          className="w-8 h-8 rounded-full"
        />
        <button className="bg-[#B38A59] text-white px-4 py-2  w-40 rounded-lg text-sm">
اضف تعليق        </button>
      </div>
    </div>
           </div>
           
        </div>
        </>
    )
}