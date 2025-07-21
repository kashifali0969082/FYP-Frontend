import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
   const [username, setusername] = useState('');
   const [tokenChecked, setTokenChecked] = useState(false);
  useEffect(() => {
 
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromURL = urlParams.get("token");
    console.log(tokenFromURL)

    if (tokenFromURL) {
      Cookies.set("access_token", tokenFromURL, { expires: 7 });

      try {
        const decoded = jwtDecode(tokenFromURL);
        setusername(decoded.name); // or decoded.email
        console.log(username)
        
      } catch (err) {
        console.error("Token decode error:", err);
      }

    
      window.history.replaceState({}, document.title, "/");  // optional
    } else {
     
      const savedToken = Cookies.get("access_token");
      if (savedToken) {
        try {
          const decoded = jwtDecode(savedToken);
           setusername(decoded.name);
        
        } catch (err) {
          console.error("Decode error from cookie:", err);
        }
      }
    }
     setTokenChecked(true)
     console.log(tokenChecked)
  }, []);
  return (
    <AuthContext.Provider value={{ username , tokenChecked}}>
      {children}
    </AuthContext.Provider>
  );
}
