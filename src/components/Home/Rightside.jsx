import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Plus } from "lucide-react";
import styles from './Home.module.css';
import post1 from '../../assets/p1.jpg';

export default function ProfileCompletion() {
  const completionPercentage = 82;
  const [animatValue, setAnimatValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000; 
    const interval = 20; 
    const steps = duration / interval;
    const increment = completionPercentage / steps;

    const animate = setInterval(() => {
      start += increment;
      setAnimatValue((prev) => 
        prev + increment > completionPercentage ? completionPercentage : prev + increment
      );

      if (start >= completionPercentage) {
        clearInterval(animate);
      }
    }, interval);

    return () => clearInterval(animate);
  }, [completionPercentage]);

  return (
  <>
    <div>
    <div className={`p-6 mt-8 ${styles.leftside} w-72 h-96`}>
      <h2 className=" font-bold text-lg mb-4">أكمل معلومات ملفك الشخصي</h2>

      <div className="w-24 mx-auto mb-6">
        <CircularProgressbar
          value={animatValue}
          text={`${Math.round(animatValue)}%`}
          styles={buildStyles({
            pathColor: "#9E2828",
            textColor: "#000",
            trailColor: "#D9D9D9",
            textSize: "16px",
          })}
        />
      </div>

      <div className="text-right space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <span>أضف صورة الملف الشخصي</span>
          <Plus className="text-gray-600 cursor-pointer" />
        </div>

        <div className="flex justify-between items-center border-b pb-2">
          <span>تخصصك</span>
          <Plus className="text-gray-600 cursor-pointer" />
        </div>

        <div className="flex justify-between items-center border-b pb-2">
          <span>طرق الدفع</span>
          <Plus className="text-gray-600 cursor-pointer" />
        </div>
      </div>
     
    </div>
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
    </div>

  </>
    
  );
}
