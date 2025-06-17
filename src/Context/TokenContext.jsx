/*import { useEffect, useState, createContext } from "react";

export let TokenContext = createContext();

export default function TokenContextProvider(props) {
    const [token, setToken] = useState(localStorage.getItem("userToken") || null);

    useEffect(() => {
        if (localStorage.getItem("userToken")) {
            setToken(localStorage.getItem("userToken"));
        }
    }, []);

    return (
        <TokenContext.Provider value={{ token, setToken }}>
            {props.children}
        </TokenContext.Provider>
    );
}

*/
import React, { useEffect, useState, createContext } from 'react';

export const TokenContext = createContext();

export default function TokenContextProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem('userToken') || localStorage.getItem('recoverToken') || null
  );

  useEffect(() => {
    const handleStorage = () => {
      const newToken =
        localStorage.getItem('userToken') || localStorage.getItem('recoverToken') || null;
      if (newToken !== token) setToken(newToken);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [token]);

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
}
