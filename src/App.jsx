
import { Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./navbar"
import Protect from "./protect"
import Register from "./pages/Register"
import Login from "./pages/Login"
import CreateOrder from "./pages/CreateOrder"
import MyOrders from "./pages/MyOrders"
import OrderDetails from "./pages/OrderDetails"
import Soon from "./pages/Soon"
import AssignedOrders from "./pages/AssignedOrders"

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/Login" />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />

        <Route
          path="/CreateOrder"
          element={
            <Protect role="user">
              <CreateOrder />
            </Protect>
          }
        />

        <Route
          path="/MyOrders"
          element={
            <Protect role="user">
              <MyOrders />
            </Protect>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <Protect role="user">
              <OrderDetails />
            </Protect>
          }
        />

        <Route path="/courier" element={<Protect role="courier"><Soon title="my deliveries" /></Protect>} />
        <Route path="/admin" element={<Protect role="admin"><Soon title="manage orders" /></Protect>} />
      </Routes>
    </div>
  )
}

export default App
