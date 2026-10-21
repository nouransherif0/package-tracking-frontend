import { Navigate } from "react-router-dom"

// only lets the right role open the page
function Protect({ role, children }) {
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user")) ;

  if (!token || !user) {
     return <Navigate to="/login" />
  }

  if (user.role !== role) {
    return <Navigate to="/login" />
  }

  return children
}

export default Protect
