import axios from "axios"

export function getuser() 
{
  try {
     return JSON.parse(localStorage.getItem("user") || "null") ;
  } 
  catch { return null ; }
}

// export alias for any import
export const getStoredUser = getuser ;


export const userapi = axios.create({
  baseURL: "http://localhost:5001/api"
}) ;

export const orderapi = axios.create({
   baseURL: "http://localhost:5002/api"
})


// add token to orders
orderapi.interceptors.request.use((req) => {
   const token = localStorage.getItem("token") ;

   if (token) 
   {
     req.headers["Authorization"] = "Bearer " + token ;
   }

  return req ;
}) ;
