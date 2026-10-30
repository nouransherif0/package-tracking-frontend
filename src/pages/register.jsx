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
      await userapi.post("/users/register", { name, email, phone, password }) /* data sent to backend */
      alert("registered, now login")
      navigate("/login")
    } catch (err) {
      setError(err.response?.data?.message || "error registering user")
    }
  }

  return (
    <div
      className="d-flex justify-content-center align-items-start min-vh-100 py-5"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="w-100" style={{ maxWidth: "520px" }}>
        <h2 className="fw-bold mb-1" style={{ color: "var(--color-title)", fontSize: "2.2rem" }}>
          Create Account
        </h2>
        

        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label fw-bold" style={{ color: "var(--color-title)" }}>
              Full name
            </label>
            <input
              type="text"
              className="form-control form-control-lg rounded-3"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold" style={{ color: "var(--color-title)" }}>
              Email
            </label>
            <input
              type="email"
              className="form-control form-control-lg rounded-3"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold" style={{ color: "var(--color-title)" }}>
              Phone
            </label>
            <input
              type="text"
              className="form-control form-control-lg rounded-3"
              placeholder="01X XXXX XXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold" style={{ color: "var(--color-title)" }}>
              Password
            </label>
            <input
              type="password"
              className="form-control form-control-lg rounded-3"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-lg w-100 rounded-3 fw-bold mt-2"
            style={{
              backgroundColor: "var(--color-btn-bg)",
              color: "var(--color-btn-text)",
              padding: "16px",
              fontSize: "1.2rem",
            }}
          >
            Register
          </button>
        </form>

        <p className="mt-4 mb-0">
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--color-link)", fontWeight: "500" }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register