import styles from './Home.module.css';
import post1 from '../../assets/p1.jpg';

export default function(){
    return(
        <>
        <div className={`p-6 mt-8 ${styles.leftside} w-72 h-96 sticky top-10`}>
            <h2 className=" font-bold text-lg mb-4">احدث المدونات</h2>
            <div className="text-right space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <img src={post1} className="w-16 h-18 ml" />
                  <span>عنوان</span>
                </div>
        
                <div className="flex justify-between items-center border-b pb-2">
                    <img src={post1} className="w-16 h-18 ml" />
                  <span>عنوان</span>
                </div>
        
                <div className="flex justify-between items-center border-b pb-2">
                    <img src={post1} className="w-16 h-18 ml" />
                  <span>عنوان</span>
                </div>
              </div>
        </div>
        </>
    )
}