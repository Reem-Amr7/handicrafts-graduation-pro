// src/components/HandicraftRecommendation.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function HandicraftRecommendation() {
  const [description, setDescription] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!description.trim()) {
      setError('من فضلك أدخل وصفاً صحيحاً.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('userToken'); // جلب التوكن من localStorage
      const response = await axios.get('https://ourheritage.runasp.net/api/HandicraftMatching/recommend', {
        params: { description },
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.data.length > 0) {
        setRecommendations(response.data);
      } else {
        setRecommendations([]);
        setError('لا توجد توصيات متاحة لهذا الوصف.');
      }
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء جلب التوصيات.');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">نظام التوصيات</h2>

      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="اكتب وصف المنتج هنا..."
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />

      <button
        onClick={handleSearch}
        className="w-full bg-[#8B4513] hover:bg-[#5D4037] text-white py-2 rounded mb-4"
      >
        بحث
      </button>

      {loading && <p className="text-center text-gray-600">جاري البحث...</p>}

      {error && <p className="text-center text-red-500">{error}</p>}

      {recommendations.length > 0 && (
        <ul className="list-disc list-inside text-right">
          {recommendations.map((artisan, index) => (
            <li key={index} className="mb-2">{artisan.fullName}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
