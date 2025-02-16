import React from 'react'
import styles from './Home.module.css';
import Post from './Post';
import Suggest from './Suggest';
export default function Maincontent() {
    return(
        <>
 <main className="col-span-6  p-9 rounded-lg ">

        <div className={`p-5 h-44  ${styles.leftside}`}>
          <h2 className="mb-4">إضافة منشور جديد</h2>
          <input type="text" placeholder="ماذا تفكر؟" className="w-full border  p-2 rounded-md " />

        </div>
        < Suggest/>
     
        

       <Post/>
       <Post/>
       <Post/>


      </main>
        </>
    )
}
