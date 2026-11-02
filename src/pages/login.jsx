
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
    <div
      className="container-fluid min-vh-100 d-flex justify-content-center"
      style={{ backgroundColor: "var(--color-bg)", padding: "75px 20px" }}
    >
      <div className="w-100" style={{ maxWidth: "546px" }}>

        <h1
          className="fw-bold mb-3"
          style={{ fontSize: "44px", color: "#17142e" }}
        >
          Log in
        </h1>

        <p
          className="mb-4"
          style={{ fontSize: "21px", color: "#35415c" }}
        >
          Use the email you registered with.
        </p>

        {error && <p className="text-danger">{error}</p>}

        <form onSubmit={submit}>

          <div className="mb-4">
            <label className="form-label fw-semibold">
              Email
            </label>

            <input
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control rounded-4 p-3"
              style={{ fontSize: "18px" }}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">
              Password
            </label>

            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control rounded-4 p-3"
              style={{ fontSize: "18px" }}
            />
          </div>

          <button
            type="submit"
            className="btn w-100 rounded-4 fw-semibold p-3"
            style={{
              backgroundColor: "#fbd2ef",
              border: "1px solid #ed83cd",
              color: "#27102c",
              fontSize: "21px"
            }}
          >
            Log in
          </button>

        </form>

        <p
          className="mt-5"
          style={{ fontSize: "18px", color: "#35415c" }}
        >
          New here?{" "}
          <Link
            to="/register"
            style={{ color: "#c21883" }}
          >
            Create an account
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login
