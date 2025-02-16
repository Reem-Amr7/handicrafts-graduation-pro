import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import blog1 from "../../assets/blog1 (1).jpg";
import blog2 from "../../assets/blog3.jpg";
import styles from "./Blog.module.css";
import Newlog from "../Home/Newlog";

export default function Blog() {
  const [country, setCountry] = useState(false);
  const navigate = useNavigate(); 

  return (
    <>
      <div>
        <h2 className="text-center mt-0">
          اكتشف جمال الحرف اليدوية العربية وتاريخها العريق من خلال مقالاتنا المميزة
        </h2>
      </div>

      <div className="mx-8 mt-9 gap-5 grid grid-cols-3 px-8">
        <div className="col-span-2 grid gap-9 grid-cols-2 ">
          <div className={styles.blogcard}>
            <img src={blog1} className="w-full h-90 cursor-pointer " 
                          onClick={() => navigate('/Blogdetails')} 

            />
            <span className="mt-2">5 مارس 2025</span>
            <h2>تعرف على الشاشية التونسية</h2>
            <span className="text-gray-700">
              اكتشف واحدة من أشهر الحرف التونسية شيوعًا وما علاقتها بالتراث التونسي العربي
            </span>
          </div>

          <div className={styles.blogcard}>
            <img src={blog2} className="w-full h-90 cursor-pointer"onClick={() => navigate('/Blogdetails')} 
 />
            <span className="mt-2">5 مارس 2025</span>
            <h2>تعرف على الشاشية التونسية</h2>
            <span className="text-gray-700">
              اكتشف واحدة من أشهر الحرف التونسية شيوعًا وما علاقتها بالتراث التونسي العربي
            </span>
          </div>

          <div className={styles.blogcard}>
            <img
              src={blog2}
              className="w-full h-90 cursor-pointer" 
              onClick={() => navigate('/Blogdetails')} 
            />
            <span className="mt-2">5 مارس 2025</span>
            <h2>تعرف على الشاشية التونسية</h2>
            <span className="text-gray-700">
              اكتشف واحدة من أشهر الحرف التونسية شيوعًا وما علاقتها بالتراث التونسي العربي
            </span>
          </div>

          <div className={styles.blogcard}>
            <img src={blog2} className="w-full h-90 cursor-pointer " 
                          onClick={() => navigate('/Blogdetails')} 

            />
            <span className="mt-2">5 مارس 2025</span>
            <h2>تعرف على الشاشية التونسية</h2>
            <span className="text-gray-700">
              اكتشف واحدة من أشهر الحرف التونسية شيوعًا وما علاقتها بالتراث التونسي العربي
            </span>
          </div>
        </div>

        <div className=" mt-0 mr-40">
          <button
            className="w-72 h-10 rounded-sm p-1"
            style={{ backgroundColor: "#B18B5E" }}
            onClick={() => setCountry(!country)}
          >
            اختار البلد <i className="fas fa-chevron-down mr-2"></i>
          </button>

          {country && (
            <div className="w-72 h-95 mt-2 rounded-sm" style={{ backgroundColor: "#FFFCFC", border: "2px solid #B18B5E" }}>
              <ul className="mr-4">
                <li>مصر</li>
                <li>العراق</li>
                <li>الكويت</li>
                <li>السعودية</li>
                <li>الإمارات العربية المتحدة</li>
                <li>الأردن</li>
                <li>فلسطين</li>
                <li>لبنان</li>
                <li>اليمن</li>
                <li>عمان</li>
                <li>الجزائر</li>
                <li>المغرب</li>
                <li>تونس</li>
              </ul>
            </div>
          )}

          <Newlog />
        </div>
      </div>
    </>
  );
}
