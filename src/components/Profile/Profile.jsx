import React from 'react';
import styles from "./Profile.module.css";
import Leftside from '../Home/Leftside';
import ProfileLeftside from './ProfileLeftside';
import backgroundProfile from './../../assets/profilebackground.png';
import profileImage from './../../assets/Ellipse 20.png';
import Maincontent from '../Home/Maincontent';

export default function Profile() {
  return (
    <div className={styles.container}>
      <div className="grid grid-cols-12 gap-4 p-4">
        {/* الجزء الرئيسي (ثلاثة أرباع الصفحة) */}
        <div className="col-span-9">
          <div
            className={styles.profileContainer}
            style={{ backgroundImage: `url(${backgroundProfile})` }}
          >
            <div className={styles.profileContent}>
              <img src={profileImage} alt="Profile" />
              <h2>اسم المستخدم</h2>
              <p>وصف مختصر</p>
             
            </div>
          </div>
          <div className={styles.stats}>
          <div>
            
                  <strong>المتابعين</strong>
                  <p>20 الف</p>
                </div>
                <div>
                  <strong>يتبع</strong>
                  <p>10 الاف</p>
                </div>
                <div>
                  <strong>عدد المنشورات</strong>
                  <p>20</p>
                </div>
                
               
              </div>
              <Maincontent/>
        </div>

        {/* الجزء الجانبي */}
        <div className="col-span-2 ">
          <ProfileLeftside />
        </div>
      </div>
    </div>
  );
}