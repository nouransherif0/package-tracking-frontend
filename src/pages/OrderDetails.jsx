
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { orderapi } from "../api"

function OrderDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getOrder() {
      try {
        const res = await orderapi.get(`/orders/${id}`)
        setOrder(res.data.order || res.data)
      } catch (err) {
        setError(err.response?.data?.message || "failed to get order details")
      } finally {
        setLoading(false)
      }
    }

    getOrder()
  }, [id])

  async function cancelOrder() {
    if (!window.confirm("are you sure you want to cancel this order?")) {
      return
    }

    try {
      const res = await orderapi.patch(`/orders/${id}/cancel`)
      setOrder(res.data.order || { ...order, status: "Cancelled" })
    } catch (err) {
      setError(err.response?.data?.message || "failed to cancel order")
    }
  }

  if (loading) {
    return <div className="container py-4">loading order...</div>
  }

  if (error && !order) {
    return <div className="container py-4 text-danger">{error}</div>
  }

  if (!order) {
    return <div className="container py-4">order not found</div>
  }

  return (
    <div className="container py-4">
      <div className="card mx-auto" style={{ maxWidth: "700px" }}>
        <div className="card-body">
          <h2 className="mb-4">order details</h2>

          {error && <p className="text-danger">{error}</p>}

          <p>
            <strong>Order ID:</strong> {order.id ?? order._id}
          </p>

          <p>
            <strong>Pickup location:</strong> {order.pickup}
          </p>

          <p>
            <strong>Drop-off location:</strong> {order.dropoff}
          </p>

          <p>
            <strong>Package details:</strong> {order.details}
          </p>

          <p>
            <strong>Delivery time:</strong> {order.deliverytime}
          </p>

          <p>
            <strong>Status:</strong> {order.status || "Pending"}
          </p>

          <hr />

          <h5>courier information</h5>

          {order.courier ? (
            <>
              <p>
                <strong>Name:</strong> {order.courier.name || "not available"}
              </p>
              <p>
                <strong>Phone:</strong> {order.courier.phone || "not available"}
              </p>
            </>
          ) : (
            <p>no courier assigned yet</p>
          )}

          {order.status?.toLowerCase() === "pending" && (
            <button className="btn btn-danger mt-2" onClick={cancelOrder}>
              cancel order
            </button>
          )}

          <button
            className="btn btn-secondary mt-2 ms-2"
            onClick={() => navigate("/MyOrders")}
          >
            back to my orders
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
