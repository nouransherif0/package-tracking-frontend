import { Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./navbar"
import Protect from "./protect"
import Register from "./pages/register"
import Login from "./pages/login"
import CreateOrder from "./pages/createorder"
import MyOrders from "./pages/MyOrders"
import OrderDetails from "./pages/OrderDetails"
import AssignedOrders from "./pages/AssignedOrders"
import ManageOrders from "./pages/ManageOrders"
import CourierAssignments from "./pages/CourierAssignments"
import UpdateStatus from "./pages/UpdateStatus"

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
         <Route path="/login" element={<Login />} />
        <Route path="/Login" element={<Login />} />
         <Route path="/register" element={<Register />} />
        <Route path="/Register" element={<Register />} />

        <Route
          path="/createorder"
           element={
            <Protect role="user">
               <CreateOrder />
            </Protect>
          }
        />
        <Route
          path="/CreateOrder"
          element={
             <Protect role="user">
              <CreateOrder />
             </Protect>
          }
        />

        <Route
          path="/myorders"
           element={
            <Protect role="user">
               <MyOrders />
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

        <Route
          path="/courier"
           element={
            <Protect role="courier">
               <AssignedOrders />
            </Protect>
          }
        />
        <Route
           path="/courier/status"
          element={
            <Protect role="courier">
               <UpdateStatus />
            </Protect>
          }
        />

        <Route
          path="/admin"
           element={
            <Protect role="admin">
               <ManageOrders />
            </Protect>
          }
        />
        <Route
           path="/admin/assignments"
          element={
            <Protect role="admin">
               <CourierAssignments />
            </Protect>
          }
        />
      </Routes>
    </div>
  )
}

export default App
