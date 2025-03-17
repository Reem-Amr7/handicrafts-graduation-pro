import Post from './Post';
import Suggest from './Suggest';
import AddPost from './addPost';
export default function (){
    return(
        <>
 <main className="col-span-6  p-9 rounded-lg ">

       <AddPost/>
        < Suggest/>
     
        

       <Post/>
    


      </main>
        </>
    )
}