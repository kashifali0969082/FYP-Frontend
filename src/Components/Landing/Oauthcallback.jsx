import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// export default function Oauthcallback(){
//     const navigate  = useNavigate()

// // const params = axios.get("https://api.adaptivelearnai.xyz/auth/callback?state=gCVlPXv7RCtzGWkDrvLjq8dwo8N6xC&code=4%2F0AVMBsJhMt9yYXBU58xQ26QYv4yFmJegTdeBj3qVUvK_9ZXHcFRyMCDvC7mtiHJpojhVeVQ&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&authuser=0&prompt=none")
// // const token = params.get("token")
//   const params = new URLSearchParams(window.location.search);
//     const token = params.get("token");

// if(token){   // token is found 

// localStorage.setItem("token",token)
// console.log(token)
// navigate("/dash")
// }else{
//     navigate("/")
// }


// }
const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get token from query parameter
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    console.log(token)
    console.log(params)

    if (token) {
      // Store token in localStorage
      localStorage.setItem("token", token);

      // Redirect to dashboard
      navigate("/dash");
    } else {
      // No token found — go to login
      navigate("/");
    }
  }, []);

  return <div><h1>haris </h1></div>

};

export default OAuthCallback;