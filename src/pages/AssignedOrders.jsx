import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { orderapi } from "../api"
import StatusBadge from "../statusbadge"

function AssignedOrders() 
{
  const [orders, setOrders] = useState([]) ;
   const [error, setError] = useState("") ;
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    async function getorders() 
    {
       try {
         const res = await orderapi.get("/orders/assigned") ;
         setOrders(Array.isArray(res.data) ? res.data : res.data.orders || [])
       } 
       catch (err) {
         setError(err.response?.data?.message || "failed to get assigned orders") ;
       } 
       finally {
         setLoading(false) ;
       }
    }

    getorders() ;
  }, [])


  async function updateorder(id, action) {
     setError("") ;

    try {
      const res = await orderapi.patch(`/orders/${id}/${action}`) ;

       setOrders(
        orders.map((order) =>
          (order.id ?? order._id) === id
            ? res.data.order || {
                ...order,
                status: action === "accept" ? "Accepted" : "Declined"
              }
            : order
        )
      ) ;
    } 
    catch (err) 
    {
       setError(err.response?.data?.message || `failed to ${action} order`) ;
    }
  }


  return (
    <div
       className="py-5 px-3 min-vh-100"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="container" style={{ maxWidth: "1050px" }}>

        <h2
           className="fw-bold mb-1"
          style={{ color: "var(--color-beige)", fontSize: "2rem" }}
        >
          my assigned orders
        </h2>

         <p
          className="mb-4"
          style={{ color: "rgba(229, 212, 184, 0.75)", fontSize: "15px" }}
        >
           view and respond to orders assigned to you by the admin
         </p>


        {error && (
          <div className="alert alert-danger py-2 mb-3 rounded-3">{error}</div>
        )}

        {loading && (
           <p style={{ color: "var(--color-beige)" }}>loading orders...</p>
        )}

        {!loading && !error && orders.length === 0 && (
          <div
             className="card p-4 text-center rounded-4"
            style={{ backgroundColor: "var(--color-card)" }}
          >
            <p className="mb-0" style={{ color: "var(--color-beige)" }}>
               no assigned orders found at the moment
            </p>
          </div>
        )}


        <div className="row g-3">
          {orders.map((order) => {
             const orderId = order.id ?? order._id ;
             const statusLower = (order.status || "Pending").toLowerCase() ;
             const canRespond = statusLower === "pending" || statusLower === "assigned" ;
             const isAccepted = ["accepted", "picked up", "in transit"].includes(statusLower) ;

            return (
              <div className="col-12 col-md-6 col-lg-4" key={orderId}>
                <div
                   className="card h-100 rounded-4 shadow-sm"
                  style={{
                     backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-card-border)"
                  }}
                >
                  <div className="card-body p-4 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5
                           className="fw-bold mb-0"
                          style={{ color: "var(--color-beige)", fontSize: "1.1rem" }}
                        >
                           order #{orderId}
                        </h5>
                        <StatusBadge status={order.status || "Pending"} />
                      </div>

                      <p className="mb-2" style={{ color: "var(--color-beige)", fontSize: "14px" }}>
                        <span style={{ color: "rgba(229, 212, 184, 0.65)" }}>pickup: </span>
                         <strong>{order.pickup}</strong>
                      </p>

                      <p className="mb-2" style={{ color: "var(--color-beige)", fontSize: "14px" }}>
                        <span style={{ color: "rgba(229, 212, 184, 0.65)" }}>drop-off: </span>
                         <strong>{order.dropoff}</strong>
                      </p>

                      <p className="mb-2" style={{ color: "var(--color-beige)", fontSize: "14px" }}>
                        <span style={{ color: "rgba(229, 212, 184, 0.65)" }}>package details: </span>
                         {order.details}
                      </p>

                      <p className="mb-3" style={{ color: "var(--color-beige)", fontSize: "14px" }}>
                        <span style={{ color: "rgba(229, 212, 184, 0.65)" }}>delivery time: </span>
                         {order.deliverytime ? new Date(order.deliverytime).toLocaleString() : "not set"}
                      </p>
                    </div>

                    <div>
                      {canRespond && (
                        <div className="d-flex gap-2 mt-3">
                          <button
                             className="btn btn-success flex-fill rounded-3 fw-semibold py-2"
                            onClick={() => updateorder(orderId, "accept")}
                          >
                             accept
                          </button>

                          <button
                             className="btn btn-danger flex-fill rounded-3 fw-semibold py-2"
                            onClick={() => updateorder(orderId, "decline")}
                          >
                             decline
                          </button>
                        </div>
                      )}

                      {isAccepted && (
                        <div className="mt-3">
                          <Link
                             to="/courier/status"
                            className="btn btn-outline-primary w-100 rounded-3 fw-semibold py-2"
                          >
                             update status &rarr;
                          </Link>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

export default AssignedOrders
