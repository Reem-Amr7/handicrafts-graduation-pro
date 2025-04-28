import React, { useState } from 'react';
import { FaHeart, FaArrowLeft } from 'react-icons/fa';
import Card from './Card';
import styles from "./Home.module.css";

const Handicrafts = () => {
  const [favorites, setFavorites] = useState([]);
  
  const products = [
    {
      id: 1,
      image: "https://www.baytalsafat.com/uploads/files/cms/images/product/5/%D8%B3%D8%AC%D8%A7%D8%AF-%D8%AE%D8%B5%D8%A7%D8%A6%D8%B5/5-carpet-4.jpg",
      title: "سجاد يدوي",
      maker: {
        name: "سعاد محمد",
        image: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      price: "1,250 ر.س"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1597070246809-c81e11ec6a1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
      title: "مجموعة خزف",
      maker: {
        name: "محمد العتيبي",
        image: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      price: "850 ر.س"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1593851772548-e8ed0436b5f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
      title: "سلة سعف النخيل",
      maker: {
        name: "فاطمة الخليفة",
        image: "https://randomuser.me/api/portraits/women/22.jpg"
      },
      price: "350 ر.س"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1605454838921-7c5e5d1a6518?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D3D&auto=format&fit=crop&w=1887&q=80",
      title: "طبق نحاس منقوش",
      maker: {
        name: "علي الزهراني",
        image: "https://randomuser.me/api/portraits/men/45.jpg"
      },
      price: "600 ر.س"
    }
  ];

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(item => item !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  return (
    <section className="handicrafts mb-16">
    <h2 className="text-3xl text-center mb-12 mt-10 text-[#8B4513] relative">
      كيف نخدم تراثنا
      <span className="block w-24 h-1 bg-[#C19A6B] mx-auto mt-4"></span>
    </h2>
  
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map(product => (
          <Card key={product.id}>
            <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-bold text-[#5D4037] mb-2">{product.title}</h3>
              <div className="flex items-center mb-2 text-[#C19A6B]">
                <img src={product.maker.image} alt={product.maker.name} className="w-8 h-8 rounded-full ml-2" />
                <span>{product.maker.name}</span>
              </div>
              <p className="text-[#8B4513] font-bold text-lg">{product.price}</p>
              <div className="flex justify-between items-center mt-4">
                <a href="#" className="btn bg-[#E6D5B8] text-[#5D4037] py-2 px-4 rounded font-semibold hover:bg-white transition inline-flex items-center">
                  عرض التفاصيل
                  <FaArrowLeft className="mr-2" />
                </a>
                <button 
                  onClick={() => toggleFavorite(product.id)}
                  className={`text-2xl ${favorites.includes(product.id) ? 'text-red-500' : 'text-gray-400'}`}
                >
                  <FaHeart />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </section>
  
  );
};

export default Handicrafts;