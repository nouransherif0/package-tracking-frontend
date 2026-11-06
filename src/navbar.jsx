import { Link, useNavigate } from "react-router-dom"
import { getuser } from "./api"

function Navbar() 
{
  const navigate = useNavigate() ;
   const user = getuser()

  function logout() 
  {
    localStorage.removeItem("token") ;
     localStorage.removeItem("user") ;
    navigate("/login") ;
  }


  return (
    <div className="navbar">
       <h3>package tracker</h3>

      <div>
        {!user && <Link to="/login">login</Link>}
         {!user && <Link to="/register">register</Link>}

        {user && user.role === "user" && <Link to="/createorder">create order</Link>}
         {user && user.role === "user" && <Link to="/myorders">my orders</Link>}

        {user && user.role === "courier" && <Link to="/courier">my deliveries</Link>}
         {user && user.role === "courier" && <Link to="/courier/status">update status</Link>}

        {user && user.role === "admin" && <Link to="/admin">manage orders</Link>}
         {user && user.role === "admin" && <Link to="/admin/assignments">assignments</Link>}

        {user && <button onClick={logout}>logout</button>}
      </div>
    </div>
  )
}

export default Navbar
