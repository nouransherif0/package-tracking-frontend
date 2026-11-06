import { useState, useEffect } from "react"
import { orderapi } from "../api"
import StatusBadge from "../statusbadge"

const statuses = ["Pending", "Accepted", "Declined", "Picked Up", "In Transit", "Delivered", "Cancelled"] ;

function ManageOrders() 
{
  const [orders, setOrders] = useState([]) ;
   const [error, setError] = useState("") ;
  const [done, setDone] = useState("") ;
   const [loading, setLoading] = useState(true)

  // the status the admin picked in each row
  const [picked, setPicked] = useState({}) ;


  useEffect(() => {
    async function getorders() 
    {
       try {
         const res = await orderapi.get("/orders/admin/all") ;
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


  async function updateorder(id) {
     setError("") ;
     setDone("") ;

    try {
      const res = await orderapi.put(`/orders/admin/${id}`, { status: picked[id] }) ;

       setOrders(orders.map((order) => (order.id === id ? res.data.order : order))) ;

      const rest = { ...picked } ;
       delete rest[id]
       setPicked(rest) ;

      setDone("order #" + id + " updated to " + picked[id].toLowerCase())
    } 
    catch (err) 
    {
       setError(err.response?.data?.message || "failed to update order") ;
    }
  }


  async function deleteorder(id) 
  {
     if (!window.confirm("are you sure you want to delete order #" + id + "?")) {
        return ;
     }

    setError("")
     setDone("") ;

    try {
      await orderapi.delete(`/orders/admin/${id}`) ;

       setOrders(orders.filter((order) => order.id !== id)) ;
       setDone("order #" + id + " deleted successfully")
    } 
    catch (err) {
       setError(err.response?.data?.message || "failed to delete order") ;
    }
  }


  return (
    <div
       className="py-5 px-3 min-vh-100"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="container" style={{ maxWidth: "1150px" }}>

        <h2
           className="fw-bold mb-1"
          style={{ color: "var(--color-beige)", fontSize: "2rem" }}
        >
          manage orders
        </h2>

         <p
          className="mb-4"
          style={{ color: "rgba(229, 212, 184, 0.75)", fontSize: "15px" }}
        >
           view all system orders, reassign statuses, or remove invalid entries
         </p>


        {error && <div className="alert alert-danger py-2 mb-3 rounded-3">{error}</div>}
         {done && <div className="alert alert-success py-2 mb-3 rounded-3">{done}</div>}

        {loading && <p style={{ color: "var(--color-beige)" }}>loading orders...</p>}


        {!loading && !error && orders.length === 0 && (
          <div
             className="card p-4 text-center rounded-4"
            style={{ backgroundColor: "var(--color-card)" }}
          >
            <p className="mb-0" style={{ color: "var(--color-beige)" }}>
               no orders found
            </p>
          </div>
        )}


        {orders.length > 0 && (
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
                    <th>pickup</th>
                     <th>drop-off</th>
                    <th>details</th>
                     <th>delivery time</th>
                    <th>courier</th>
                     <th>status</th>
                    <th>change status</th>
                     <th></th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="fw-bold" style={{ color: "var(--color-orange)" }}>
                         #{order.id}
                      </td>

                      <td style={{ color: "var(--color-beige)" }}>{order.pickup}</td>
                       <td style={{ color: "var(--color-beige)" }}>{order.dropoff}</td>
                      <td style={{ color: "rgba(229, 212, 184, 0.85)" }}>{order.details}</td>

                      <td style={{ color: "rgba(229, 212, 184, 0.85)" }}>
                         {order.deliverytime ? new Date(order.deliverytime).toLocaleString() : "not set"}
                      </td>

                      <td style={{ color: "var(--color-beige)" }}>
                        {order.courierid ? "#" + order.courierid : "none"}
                      </td>

                      <td>
                         <StatusBadge status={order.status} />
                      </td>

                      <td style={{ minWidth: "220px" }}>
                        <div className="d-flex gap-2">
                          <select
                             className="form-select form-select-sm rounded-3"
                            value={picked[order.id] ?? order.status}
                             onChange={(e) => setPicked({ ...picked, [order.id]: e.target.value })}
                          >
                            {statuses.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>

                          <button
                             className="btn btn-sm rounded-3 fw-bold"
                            style={{
                              backgroundColor: "var(--color-orange)",
                               border: "none",
                              color: "#ffffff",
                               textTransform: "lowercase"
                            }}
                            disabled={picked[order.id] === undefined || picked[order.id] === order.status}
                             onClick={() => updateorder(order.id)}
                          >
                             update
                          </button>
                        </div>
                      </td>

                      <td className="text-end">
                        <button
                           className="btn btn-danger btn-sm rounded-3 fw-semibold"
                          onClick={() => deleteorder(order.id)}
                           style={{ textTransform: "lowercase" }}
                        >
                           delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ManageOrders
