import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { userapi } from "../api"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function submit(e) {
    e.preventDefault()
    setError("")

    try {
      const res = await userapi.post("/users/login", { email, password })


      //after login, the frontend receives the token and save it in local storage
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))

      // go to a different page for each role
      const role = res.data.user.role

      if (role === "admin") {
         navigate("/admin")
      } else if (role === "courier") {
         navigate("/courier")
      } else {
         navigate("/createorder")
      }

    } catch (err) {
      if (err.response && err.response.data) {
         setError(err.response.data.message)
      } else {
         setError("login failed")
      }
    }
  }

  return (
    <div className="box">
      <h2>login</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={submit}>
        <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit">login</button>
      </form>

      <p>no account? <Link to="/register">register</Link></p>
    </div>
  )
}

export default Login
