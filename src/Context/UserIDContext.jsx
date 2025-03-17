// import { createContext, useState, useEffect } from "react";

// export const UserIDContext = createContext();

// export default function UserIDContextProvider({ children }) {
//     const [userId, setUserId] = useState(localStorage.getItem('userId') || null);

//     useEffect(() => {
//         const storedUserId = localStorage.getItem('userId');
//         if (storedUserId) {
//             setUserId(storedUserId);
//         }
//     }, []);

//     return (
//         <UserIDContext.Provider value={{ userId, setUserId }}>
//             {children}
//         </UserIDContext.Provider>
//     );
// }
