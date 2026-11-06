import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { orderapi } from "../api"
import StatusBadge from "../statusbadge"

const steps = ["placed", "picked up", "in transit", "delivered"]

function clean(status) {
   return (status || "Pending").toString().toLowerCase().replace(/[_-]/g, " ").trim() ;
}

function currentstep(status) 
{
  const s = clean(status)
   if (s === "delivered") { return steps.length ; }
  if (s === "in transit") return 2 ;
   if (s === "picked up") return 1
  if (s === "cancelled") { return -1 ; }
   return 0 ;
}

function hourtext(h) {
   return (h % 12 || 12) + (h % 24 >= 12 ? " PM" : " AM") ;
}

function showtime(value) 
{
   if (!value) return "not set"

  const d = new Date(value) ;
   if (isNaN(d)) return String(value) ;

  const day = d.toLocaleDateString("en-US", { weekday: "short" }) ;
   const h = d.getHours()

  if (d.getMinutes() === 0 && [9, 12, 15, 18].includes(h)) 
  {
     return `${day}, ${hourtext(h)} - ${hourtext(h + 3)}` ;
  }

  return `${day}, ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
}


function OrderDetails() 
{
  const { id } = useParams() ;
   const navigate = useNavigate() ;

  const [order, setOrder] = useState(null)
   const [error, setError] = useState("") ;
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    async function getorder() 
    {
       try {
         const res = await orderapi.get(`/orders/${id}`) ;
         setOrder(res.data.order || res.data)
       } 
       catch (err) {
         setError(err.response?.data?.message || "failed to get order details") ;
       } 
       finally {
         setLoading(false) ;
       }
    }

    getorder() ;
  }, [id])


  async function cancelorder() {
     if (!window.confirm("are you sure you want to cancel this order?")) {
        return ;
     }

    try {
       const res = await orderapi.patch(`/orders/${id}/cancel`) ;
       setOrder(res.data.order || { ...order, status: "Cancelled" }) ;
    } 
    catch (err) 
    {
       setError(err.response?.data?.message || "failed to cancel order") ;
    }
  }


  if (loading) {
    return (
       <div className="py-5 px-3 min-vh-100" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="container" style={{ maxWidth: "1000px", color: "var(--color-beige)" }}>
           loading order...
        </div>
      </div>
    )
  }

  if (error && !order) 
  {
    return (
       <div className="py-5 px-3 min-vh-100" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="container text-danger" style={{ maxWidth: "1000px" }}>
           {error}
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="py-5 px-3 min-vh-100" style={{ backgroundColor: "var(--color-bg)" }}>
         <div className="container" style={{ maxWidth: "1000px", color: "var(--color-beige)" }}>
          order not found
         </div>
      </div>
    ) ;
  }

  const step = currentstep(order.status)
   const isPending = order.status?.toLowerCase() === "pending" ;


  return (
    <div
       className="py-5 px-3 min-vh-100"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="container" style={{ maxWidth: "1000px" }}>

        <button
           className="btn btn-link p-0 mb-3 text-decoration-none fw-semibold"
          style={{ color: "var(--color-orange)", fontSize: "14px" }}
           onClick={() => navigate("/myorders")}
        >
           &larr; back to my orders
        </button>


        <div className="d-flex align-items-center gap-3 mb-4">
          <h2
             className="fw-bold m-0"
            style={{ color: "var(--color-beige)", fontSize: "2rem" }}
          >
             order #{order.id ?? order._id}
          </h2>
           <StatusBadge status={order.status || "Pending"} />
        </div>


        {error && <div className="alert alert-danger py-2 mb-3 rounded-3">{error}</div>}


        <div className="row g-3">
          <div className="col-12 col-lg-8">
            <div
               className="rounded-4 p-4 h-100 shadow-sm"
              style={{
                 backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-card-border)"
              }}
            >
              <h5
                 className="fw-bold mb-3"
                style={{ color: "var(--color-beige)" }}
              >
                 route details
              </h5>

              <div className="row g-3 mb-4">
                 <div className="col-12 col-md-6">
                  <div style={{ color: "rgba(229, 212, 184, 0.65)", fontSize: "13px" }}>pickup address</div>
                  <div className="fw-semibold" style={{ color: "var(--color-beige)", fontSize: "15px" }}>
                     {order.pickup}
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div style={{ color: "rgba(229, 212, 184, 0.65)", fontSize: "13px" }}>drop-off address</div>
                   <div className="fw-semibold" style={{ color: "var(--color-beige)", fontSize: "15px" }}>
                    {order.dropoff}
                   </div>
                </div>
              </div>


              <h5
                 className="fw-bold mb-3"
                style={{ color: "var(--color-beige)" }}
              >
                 package details
              </h5>

              <div className="mb-3">
                <div style={{ color: "rgba(229, 212, 184, 0.65)", fontSize: "13px" }}>preferred delivery time</div>
                 <div className="fw-semibold" style={{ color: "var(--color-beige)" }}>
                  {showtime(order.deliverytime)}
                 </div>
              </div>

              <div className="mb-4">
                <div style={{ color: "rgba(229, 212, 184, 0.65)", fontSize: "13px" }}>notes & instructions</div>
                 <div style={{ color: "var(--color-beige)" }}>{order.details}</div>
              </div>


              <h5
                 className="fw-bold mb-3"
                style={{ color: "var(--color-beige)" }}
              >
                 delivery progress
              </h5>

              <div className="row g-2">
                {steps.map((name, i) => {
                   let style = {
                    backgroundColor: "rgba(229, 212, 184, 0.05)",
                     color: "rgba(229, 212, 184, 0.4)",
                    border: "1px solid rgba(229, 212, 184, 0.15)"
                   } ;

                  if (i < step) {
                     style = {
                      backgroundColor: "rgba(229, 212, 184, 0.18)",
                       color: "#e5d4b8",
                      border: "1px solid rgba(229, 212, 184, 0.45)"
                     }
                  } else if (i === step) {
                     style = {
                      backgroundColor: "rgba(255, 78, 0, 0.22)",
                       color: "#ff7033",
                      border: "1px solid #ff4e00"
                     } ;
                  }

                  return (
                     <div className="col-6 col-md-3" key={name}>
                      <div
                         className="rounded-pill px-3 py-2 text-center fw-semibold"
                        style={{ ...style, fontSize: "12px", textTransform: "lowercase" }}
                      >
                         {name}
                      </div>
                    </div>
                  )
                })}
              </div>

            </div>
          </div>


          <div className="col-12 col-lg-4">
            <div
               className="rounded-4 p-4 shadow-sm"
              style={{
                 backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-card-border)"
              }}
            >
              <h5
                 className="fw-bold mb-3"
                style={{ color: "var(--color-beige)" }}
              >
                 courier
              </h5>

              {order.courier ? (
                <>
                   <div className="fw-bold mb-1" style={{ color: "var(--color-beige)" }}>
                    {order.courier.name || "assigned courier"}
                   </div>
                  <div className="mb-3" style={{ color: "rgba(229, 212, 184, 0.7)", fontSize: "14px" }}>
                     phone: {order.courier.phone || "not available"}
                  </div>
                </>
              ) : (
                <div className="mb-3" style={{ color: "rgba(229, 212, 184, 0.6)", fontSize: "14px" }}>
                   no courier assigned yet
                </div>
              )}

              {order.courier?.phone ? (
                <a
                   href={`tel:${order.courier.phone}`}
                  className="btn w-100 rounded-3 fw-semibold mb-2"
                  style={{
                    backgroundColor: "transparent",
                     border: "1px solid var(--color-orange)",
                    color: "var(--color-orange)"
                  }}
                >
                   call courier
                </a>
              ) : (
                <button
                  className="btn w-100 rounded-3 fw-semibold mb-2"
                  style={{
                    backgroundColor: "rgba(229, 212, 184, 0.05)",
                     border: "1px solid rgba(229, 212, 184, 0.15)",
                    color: "rgba(229, 212, 184, 0.3)"
                  }}
                  disabled
                >
                   call courier
                </button>
              )}


              <button
                 className="btn btn-danger w-100 rounded-3 fw-semibold mb-2"
                onClick={cancelorder}
                disabled={!isPending}
                style={{ textTransform: "lowercase" }}
              >
                 cancel order
              </button>

              <div style={{ color: "rgba(229, 212, 184, 0.5)", fontSize: "12px" }}>
                 only pending orders can be cancelled
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default OrderDetails
