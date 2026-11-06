import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { userapi } from "../api"

function Register() 
{
  const navigate = useNavigate() ;

  const [name, setName] = useState("")
   const [email, setEmail] = useState("") ;
  const [phone, setPhone] = useState("")
   const [password, setPassword] = useState("") ;
  const [error, setError] = useState("")


  async function submit(e) {
     e.preventDefault() ;
     setError("")

    try {
       await userapi.post("/users/register", { name, email, phone, password }) ;
       alert("registered successfully, now login") ;
       navigate("/login") ;
    } 
    catch (err) 
    {
       setError(err.response?.data?.message || "error registering user")
    }
  }


  return (
    <div
       className="container-fluid min-vh-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "var(--color-bg)", padding: "40px 20px" }}
    >
      <div className="w-100" style={{ maxWidth: "480px" }}>

        <div className="text-center mb-4">
          <h2
             className="fw-bold mb-2"
            style={{ fontSize: "32px", color: "var(--color-beige)" }}
          >
             create account
          </h2>

          <p style={{ fontSize: "15px", color: "rgba(229, 212, 184, 0.75)" }}>
            start managing and tracking your packages
          </p>
        </div>


        {error && (
          <div className="alert alert-danger py-2 mb-3 rounded-3" role="alert">
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
              full name
            </label>
            <input
               type="text"
              className="form-control rounded-3 p-3"
              placeholder="e.g. John Doe"
              value={name}
               onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small" style={{ color: "var(--color-beige)" }}>
              email address
            </label>
            <input
               type="email"
              className="form-control rounded-3 p-3"
              placeholder="name@example.com"
              value={email}
               onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small" style={{ color: "var(--color-beige)" }}>
              phone number
            </label>
            <input
               type="text"
              className="form-control rounded-3 p-3"
              placeholder="01012345678"
              value={phone}
               onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold small" style={{ color: "var(--color-beige)" }}>
              password
            </label>
            <input
               type="password"
              className="form-control rounded-3 p-3"
              placeholder="minimum 6 characters"
              value={password}
               onChange={(e) => setPassword(e.target.value)}
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
             create account
          </button>
        </form>


        <p className="mt-4 text-center" style={{ fontSize: "14px", color: "rgba(229, 212, 184, 0.7)" }}>
          already have an account?{" "}
          <Link to="/login" style={{ color: "var(--color-orange)", fontWeight: "bold", textDecoration: "none" }}>
             sign in here
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Register
