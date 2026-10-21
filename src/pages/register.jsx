import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { userapi } from "../api"

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function submit(e) {
    e.preventDefault()
    setError("")

    try {
      await userapi.post("/users/register", { name, email, phone, password })

      alert("registered, now login")
      navigate("/login")

    } catch (err) {
       setError(err.response?.data?.message || "error registering user")
    }
  }

  return (
    <div className="box">
      <h2>register</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={submit}>
        <input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />

        <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <input placeholder="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />

        <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit">register</button>
      </form>

      <p>have an account? <Link to="/login">login</Link></p>
    </div>
  )
}

export default Register
