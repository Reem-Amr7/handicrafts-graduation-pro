import { createContext, useState } from 'react';

// إنشاء Context
export const CategoryContext = createContext();

// مكوّن Provider لتزويد التطبيق بالفئة المختارة
export const CategoryProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState('الكل'); // القيمة الافتراضية هي "الكل"

  return (
    <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};