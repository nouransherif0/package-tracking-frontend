
import { useState, useEffect } from "react"
import { orderapi } from "../api"

function AssignedOrders() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getOrders() {
      try {
        const res = await orderapi.get("/orders/assigned")
        setOrders(Array.isArray(res.data) ? res.data : res.data.orders || [])
      } catch (err) {
        setError(err.response?.data?.message || "failed to get assigned orders")
      } finally {
        setLoading(false)
      }
    }

    getOrders()
  }, [])

  async function updateOrder(id, action) {
    setError("")

    try {
      const res = await orderapi.patch(`/orders/${id}/${action}`)

      setOrders(orders.map((order) =>
        order._id === id
          ? res.data.order || {
              ...order,
              status: action === "accept" ? "Accepted" : "Declined"
            }
          : order
      ))
    } catch (err) {
      setError(err.response?.data?.message || `failed to ${action} order`)
    }
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">my assigned orders</h2>

      {error && <p className="text-danger">{error}</p>}

      {loading && <p>loading orders...</p>}

      {!loading && !error && orders.length === 0 && (
        <p>no assigned orders found</p>
      )}

      <div className="row g-3">
        {orders.map((order) => (
          <div className="col-12 col-md-6 col-lg-4" key={order._id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">
                  Order #{order._id}
                </h5>

                <p>
                  <strong>Pickup:</strong> {order.pickup}
                </p>

                <p>
                  <strong>Drop-off:</strong> {order.dropoff}
                </p>

                <p>
                  <strong>Package details:</strong> {order.details}
                </p>

                <p>
                  <strong>Status:</strong> {order.status || "Pending"}
                </p>

                {(!order.status || order.status.toLowerCase() === "pending") && (
                  <div>
                    <button
                      className="btn btn-success me-2"
                      onClick={() => updateOrder(order._id, "accept")}
                    >
                      accept
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => updateOrder(order._id, "decline")}
                    >
                      decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AssignedOrders
