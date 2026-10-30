
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { orderapi } from "../api"

function MyOrders() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getOrders() {
      try {
        const res = await orderapi.get("/orders")
        setOrders(Array.isArray(res.data) ? res.data : res.data.orders || [])
      } catch (err) {
        setError(err.response?.data?.message || "failed to get orders")
      } finally {
        setLoading(false)
      }
    }

    getOrders()
  }, [])

  return (
    <div className="container py-4">
      <h2 className="mb-4">my orders</h2>

      {error && <p className="text-danger">{error}</p>}

      {loading && <p>loading orders...</p>}

      {!loading && !error && orders.length === 0 && (
        <p>no orders found</p>
      )}

      <div className="row g-3">
        {orders.map((order) => (
          <div className="col-12 col-md-6 col-lg-4" key={order.id ?? order._id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">
                  Order #{order.id ?? order._id}
                </h5>

                <p>
                  <strong>Pickup:</strong> {order.pickup}
                </p>

                <p>
                  <strong>Drop-off:</strong> {order.dropoff}
                </p>

                <p>
                  <strong>Details:</strong> {order.details}
                </p>

                <p>
                  <strong>Delivery time:</strong> {order.deliverytime ? new Date(order.deliverytime).toLocaleString() : "Not set"}
                </p>

                <p className="mb-0">
                  <strong>Status:</strong> {order.status || "Pending"}
                </p>
                <Link className="btn btn-primary mt-3" to={`/orders/${order.id ?? order._id}`}>View details</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyOrders
