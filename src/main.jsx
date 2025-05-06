import { StrictMode } from 'react';
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
