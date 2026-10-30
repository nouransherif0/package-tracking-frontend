import { Navigate } from "react-router-dom"
import { getStoredUser } from "./api"

// only lets the right role open the page
function Protect({ role, children }) {
  const token = localStorage.getItem("token")
  const user = getStoredUser()

  if (!token || !user) {
     return <Navigate to="/login" />
  }

  if (user.role !== role) {
    return <Navigate to="/login" />
  }

  return children
}

export default Protect
