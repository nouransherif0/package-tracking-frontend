import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { orderapi } from "../api"
import StatusBadge from "../statusbadge"

const filters = ["all", "pending", "in transit", "delivered", "cancelled"]

function clean(status) 
{
   return (status || "Pending").toString().toLowerCase().replace(/[_-]/g, " ").trim() ;
}

function hourtext(h) {
  return (h % 12 || 12) + (h % 24 >= 12 ? " PM" : " AM") ;
}

// shows e.g. "Sat, 12 PM - 3 PM"
function showtime(value) {
   if (!value) { return "not set" ; }

  const d = new Date(value) ;
  if (isNaN(d)) return String(value) ;

   const day = d.toLocaleDateString("en-US", { weekday: "short" }) ;
   const h = d.getHours() ;

  if (d.getMinutes() === 0 && [9, 12, 15, 18].includes(h)) 
  {
     return `${day}, ${hourtext(h)} - ${hourtext(h + 3)}`
  }

  return `${day}, ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}` ;
}


function MyOrders() 
{
  const [orders, setOrders] = useState([]) ;
   const [error, setError] = useState("") ;
  const [loading, setLoading] = useState(true)
   const [filter, setFilter] = useState("all") ;


  useEffect(() => {
    async function getorders() 
    {
       try {
         const res = await orderapi.get("/orders") ;
         setOrders(Array.isArray(res.data) ? res.data : res.data.orders || [])
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


  const shown = filter === "all"
    ? orders
    : orders.filter((order) => clean(order.status) === filter) ;


  return (
    <div
       className="py-5 px-3 min-vh-100"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="container" style={{ maxWidth: "1000px" }}>

        <h2
           className="fw-bold mb-1"
          style={{ color: "var(--color-beige)", fontSize: "2rem" }}
        >
          my orders
        </h2>

         <p
          className="mb-4"
          style={{ color: "rgba(229, 212, 184, 0.75)", fontSize: "15px" }}
        >
           all your packages and their current delivery statuses
         </p>


        {/* filter pills */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          {filters.map((name) => {
             const active = filter === name ;
            return (
              <button
                key={name}
                 type="button"
                onClick={() => setFilter(name)}
                className="btn btn-sm rounded-pill px-3 py-1 fw-semibold"
                style={{
                  backgroundColor: active ? "var(--color-orange)" : "rgba(229, 212, 184, 0.08)",
                   color: active ? "#ffffff" : "var(--color-beige)",
                  border: active ? "1px solid var(--color-orange)" : "1px solid rgba(229, 212, 184, 0.2)",
                   fontSize: "13px",
                  textTransform: "lowercase"
                }}
              >
                 {name}
              </button>
            )
          })}
        </div>


        {error && <div className="alert alert-danger py-2 mb-3 rounded-3">{error}</div>}

         {loading && <p style={{ color: "var(--color-beige)" }}>loading orders...</p>}

        {!loading && !error && shown.length === 0 && (
          <div
             className="card p-4 text-center rounded-4"
            style={{ backgroundColor: "var(--color-card)" }}
          >
            <p className="mb-0" style={{ color: "var(--color-beige)" }}>
               no orders found under "{filter}"
            </p>
          </div>
        )}


        {shown.length > 0 && (
          <div
             className="rounded-4 overflow-hidden shadow-sm"
            style={{
               backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-card-border)"
            }}
          >
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                     <th>order</th>
                    <th>drop-off</th>
                     <th>delivery time</th>
                    <th>status</th>
                     <th></th>
                  </tr>
                </thead>

                <tbody>
                  {shown.map((order) => {
                     const id = order.id ?? order._id ;

                    return (
                      <tr key={id}>
                        <td>
                          <Link
                             to={`/orders/${id}`}
                            className="fw-bold text-decoration-none"
                             style={{ color: "var(--color-orange)" }}
                          >
                             #{id}
                          </Link>
                        </td>

                        <td style={{ color: "var(--color-beige)" }}>{order.dropoff}</td>

                        <td style={{ color: "rgba(229, 212, 184, 0.85)" }}>
                           {showtime(order.deliverytime)}
                        </td>

                        <td>
                           <StatusBadge status={order.status || "Pending"} />
                        </td>

                        <td className="text-end">
                          <Link
                             to={`/orders/${id}`}
                            className="btn btn-sm rounded-3 fw-semibold"
                            style={{
                              backgroundColor: "rgba(229, 212, 184, 0.1)",
                               color: "var(--color-beige)",
                              border: "1px solid rgba(229, 212, 184, 0.25)",
                               fontSize: "12px",
                              textTransform: "lowercase"
                            }}
                          >
                             view details &rarr;
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default MyOrders
