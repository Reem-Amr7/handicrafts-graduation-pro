/*import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import "./../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import './index.css';
import App from './App.jsx';
import TokenContextProvider from './Context/TokenContext.jsx';
import { PostProvider } from './Context/PostContext.jsx';
import { UserProvider } from './Context/User Context.jsx';  // تأكد من المسار الصحيح

createRoot(document.getElementById('root')).render(
  <TokenContextProvider>
    <UserProvider>
      <PostProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </PostProvider>
    </UserProvider>
  </TokenContextProvider>
);
*/
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// ✅ الاستيرادات
import { CartProvider } from './Context/CartContext';
import TokenContextProvider from './Context/TokenContext';
import { UserProvider } from './Context/User Context'; // تأكد من اسم الملف الصحيح

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TokenContextProvider>
      <CartProvider>
        <UserProvider> {/* ✅ أضف الـ UserProvider هنا */}
          <App />
        </UserProvider>
      </CartProvider>
    </TokenContextProvider>
  </React.StrictMode>
);
