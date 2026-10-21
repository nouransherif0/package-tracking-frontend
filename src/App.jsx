import { Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./navbar"
import Protect from "./protect"
import Register from "./pages/register"
import Login from "./pages/login"
import CreateOrder from "./pages/createorder"
import Soon from "./pages/soon"

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/createorder" element={<Protect role="user"><CreateOrder /></Protect>} />

        {/* team will replace these */}
        <Route path="/myorders" element={<Protect role="user"><Soon title="my orders" /></Protect>} />
        <Route path="/courier" element={<Protect role="courier"><Soon title="my deliveries" /></Protect>} />
        <Route path="/admin" element={<Protect role="admin"><Soon title="manage orders" /></Protect>} />
      </Routes>
    </div>
  )
}

export default App
