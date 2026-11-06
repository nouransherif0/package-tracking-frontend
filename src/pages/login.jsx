import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { userapi } from "../api"

function Login() 
{
  const navigate = useNavigate() ;

  const [email, setEmail] = useState("") ;
   const [password, setPassword] = useState("") ;
  const [error, setError] = useState("")


  async function submit(e) {
     e.preventDefault() ;
    setError("")

    try {
      const res = await userapi.post("/users/login", { email, password }) ;

       localStorage.setItem("token", res.data.token) ;
      localStorage.setItem("user", JSON.stringify(res.data.user)) ;

      const role = res.data.user.role ;

      if (role === "admin") {
          navigate("/admin") ;
      } else if (role === "courier") { navigate("/courier") ; }
      else 
      {
          navigate("/createorder") ;
      }

    } 
    catch (err) 
    {
       if (err.response && err.response.data) {
          setError(err.response.data.message)
       } else {
          setError("login failed") ;
       }
    }
  }


  return (
    <div
       className="container-fluid min-vh-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "var(--color-bg)", padding: "40px 20px" }}
    >
      <div className="w-100" style={{ maxWidth: "460px" }}>

        <div className="text-center mb-4">
          <h1
             className="fw-bold mb-2"
            style={{ fontSize: "32px", color: "var(--color-beige)" }}
          >
             welcome back
          </h1>

          <p style={{ fontSize: "15px", color: "rgba(229, 212, 184, 0.75)" }}>
            sign in to your package tracker account
          </p>
        </div>


        {error && (
          <div className="alert alert-danger py-2 mb-3 rounded-3">
             {error}
          </div>
        )}


        <form
           onSubmit={submit}
          className="p-4 p-md-5 rounded-4 shadow-sm"
          style={{
             backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-card-border)"
          }}
        >

          <div className="mb-3">
            <label className="form-label fw-semibold small" style={{ color: "var(--color-beige)" }}>
              email address
            </label>

            <input
               type="email"
              placeholder="name@example.com"
              value={email}
               onChange={(e) => setEmail(e.target.value)}
              className="form-control rounded-3 p-3"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold small" style={{ color: "var(--color-beige)" }}>
              password
            </label>

            <input
               type="password"
              placeholder="enter your password"
              value={password}
               onChange={(e) => setPassword(e.target.value)}
              className="form-control rounded-3 p-3"
              required
            />
          </div>


          <button
             type="submit"
            className="btn w-100 rounded-3 fw-bold p-3"
            style={{
              backgroundColor: "var(--color-orange)",
               color: "#ffffff",
              border: "none",
               fontSize: "16px"
            }}
          >
             sign in
          </button>

        </form>


        <p
           className="mt-4 text-center"
          style={{ fontSize: "14px", color: "rgba(229, 212, 184, 0.7)" }}
        >
          don't have an account?{" "}
          <Link
             to="/register"
            style={{ color: "var(--color-orange)", fontWeight: "bold", textDecoration: "none" }}
          >
             create one here
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login
