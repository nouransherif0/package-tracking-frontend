import { useState, useEffect } from "react"
import { orderapi } from "../api"
import StatusBadge from "../statusbadge"

// next step for courier
const nextstep = {
  "Accepted": "Picked Up",
   "Picked Up": "In Transit",
  "In Transit": "Delivered"
} ;

const buttontext = {
  "Picked Up": "mark as picked up",
   "In Transit": "mark as in transit",
  "Delivered": "mark as delivered"
} ;

// orders the courier accepted
const shown = ["Accepted", "Picked Up", "In Transit", "Delivered"] ;

function UpdateStatus() 
{
  const [orders, setOrders] = useState([]) ;
   const [error, setError] = useState("") ;
  const [done, setDone] = useState("") ;
   const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(null) ;


  useEffect(() => {
    async function getorders() 
    {
       try {
         const res = await orderapi.get("/orders/assigned") ;
         setOrders(Array.isArray(res.data) ? res.data : res.data.orders || []) ;
       } 
       catch (err) {
         setError(err.response?.data?.message || "failed to get orders") ;
       } 
       finally {
         setLoading(false) ;
       }
    }

    getorders() ;
  }, [])


  async function updatestatus(id, status) {
     setError("") ;
     setDone("") ;
    setBusy(id)

    try {
      const res = await orderapi.put(`/orders/${id}/status`, { status }) ;

       setOrders(orders.map((order) => (order.id === id ? res.data.order : order))) ;
       setDone("order #" + id + " is now " + status.toLowerCase()) ;
    } 
    catch (err) 
    {
       setError(err.response?.data?.message || "failed to update status") ;
    } 
    finally {
       setBusy(null) ;
    }
  }

  const myorders = orders.filter((order) => shown.includes(order.status)) ;


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
          update order status
        </h2>

         <p
          className="mb-4"
          style={{ color: "rgba(229, 212, 184, 0.75)", fontSize: "15px" }}
        >
           move your accepted orders from picked up to delivered step by step
         </p>


        {error && <div className="alert alert-danger py-2 mb-3 rounded-3">{error}</div>}
         {done && <div className="alert alert-success py-2 mb-3 rounded-3">{done}</div>}

        {loading && <p style={{ color: "var(--color-beige)" }}>loading orders...</p>}


        {!loading && !error && myorders.length === 0 && (
          <div
             className="card p-4 text-center rounded-4"
            style={{ backgroundColor: "var(--color-card)" }}
          >
            <p className="mb-0" style={{ color: "var(--color-beige)" }}>
               no accepted orders yet. accept an assigned order in my deliveries first
            </p>
          </div>
        )}


        <div className="row g-3">
          {myorders.map((order) => (
            <div className="col-12 col-md-6 col-lg-4" key={order.id}>
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
                         order #{order.id}
                      </h5>
                      <StatusBadge status={order.status} />
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

                  <div className="mt-3">
                    {nextstep[order.status] ? (
                      <button
                         className="btn w-100 rounded-3 fw-bold p-2"
                        style={{
                          backgroundColor: "var(--color-orange)",
                           border: "none",
                          color: "#ffffff"
                        }}
                        disabled={busy === order.id}
                         onClick={() => updatestatus(order.id, nextstep[order.status])}
                      >
                         {busy === order.id ? "updating..." : buttontext[nextstep[order.status]]}
                      </button>
                    ) : (
                      <div
                         className="text-center py-2 rounded-3"
                        style={{
                          backgroundColor: "rgba(40, 167, 69, 0.15)",
                           color: "#7fe39a",
                          border: "1px solid rgba(40, 167, 69, 0.3)",
                           fontSize: "13px",
                          fontWeight: 600
                        }}
                      >
                         this order is delivered
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default UpdateStatus
