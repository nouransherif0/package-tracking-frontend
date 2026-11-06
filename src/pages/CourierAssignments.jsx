import { useState, useEffect } from "react"
import { orderapi } from "../api"
import StatusBadge from "../statusbadge"

function CourierAssignments() 
{
  const [unassigned, setUnassigned] = useState([]) ;
   const [assigned, setAssigned] = useState([]) ;
  const [error, setError] = useState("") ;
   const [done, setDone] = useState("") ;
  const [loading, setLoading] = useState(true)

  // the courier id typed in each row
  const [picks, setPicks] = useState({}) ;

  // changing this number loads the lists again
  const [refresh, setRefresh] = useState(0) ;


  useEffect(() => {
    async function getdata() 
    {
       try {
         const res1 = await orderapi.get("/orders/admin/all") ;
         const res2 = await orderapi.get("/orders/admin/assignments") ;

        // orders with no courier that are still open
         setUnassigned(
           res1.data.filter((o) => !o.courierid && o.status !== "Delivered" && o.status !== "Cancelled")
         ) ;
         setAssigned(res2.data) ;
       } 
       catch (err) {
          setError(err.response?.data?.message || "failed to get orders") ;
       } 
       finally {
         setLoading(false) ;
       }
    }

    getdata() ;
  }, [refresh])


  async function assignorder(id) {
     setError("") ;
     setDone("")

    if (!picks[id]) {
       setError("type a courier id first") ;
       return ;
    }

    try {
       await orderapi.put(`/orders/admin/${id}/assign`, { courierid: Number(picks[id]) }) ;

       setPicks({ ...picks, [id]: "" }) ;
       setDone("order #" + id + " assigned to courier #" + picks[id])
       setRefresh(refresh + 1) ;
    } 
    catch (err) 
    {
       setError(err.response?.data?.message || "failed to assign order") ;
    }
  }


  function picker(id, label) 
  {
    return (
      <div className="d-flex gap-2">
        <input
           type="number"
          min="1"
          placeholder="courier id"
           className="form-control form-control-sm rounded-3"
          style={{ width: "120px" }}
          value={picks[id] || ""}
           onChange={(e) => setPicks({ ...picks, [id]: e.target.value })}
        />

        <button
           className="btn btn-sm rounded-3 fw-bold"
          style={{
            backgroundColor: "var(--color-orange)",
             border: "none",
            color: "#ffffff",
             textTransform: "lowercase"
          }}
           onClick={() => assignorder(id)}
        >
          {label}
        </button>
      </div>
    ) ;
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
          courier assignments
        </h2>

         <p
          className="mb-4"
          style={{ color: "rgba(229, 212, 184, 0.75)", fontSize: "15px" }}
        >
           assign open orders to available couriers, or transfer orders between couriers
         </p>


        {error && <div className="alert alert-danger py-2 mb-3 rounded-3">{error}</div>}
         {done && <div className="alert alert-success py-2 mb-3 rounded-3">{done}</div>}

        {loading && <p style={{ color: "var(--color-beige)" }}>loading orders...</p>}


        {!loading && (
          <>
            <h4
               className="fw-bold mb-3 mt-4"
              style={{ color: "var(--color-beige)", fontSize: "1.25rem" }}
            >
               orders waiting for a courier
            </h4>

            {unassigned.length === 0 ? (
              <div
                 className="card p-3 rounded-4 mb-4"
                style={{ backgroundColor: "var(--color-card)" }}
              >
                <p className="mb-0" style={{ color: "rgba(229, 212, 184, 0.8)" }}>
                   no orders waiting for a courier
                </p>
              </div>
            ) : (
              <div
                 className="rounded-4 overflow-hidden shadow-sm mb-4"
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
                        <th>status</th>
                         <th>assign to courier</th>
                      </tr>
                    </thead>

                    <tbody>
                      {unassigned.map((order) => (
                        <tr key={order.id}>
                          <td className="fw-bold" style={{ color: "var(--color-orange)" }}>
                             #{order.id}
                          </td>
                          <td style={{ color: "var(--color-beige)" }}>{order.pickup}</td>
                           <td style={{ color: "var(--color-beige)" }}>{order.dropoff}</td>
                          <td><StatusBadge status={order.status} /></td>
                           <td>{picker(order.id, "assign")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}


            <h4
               className="fw-bold mb-3 mt-5"
              style={{ color: "var(--color-beige)", fontSize: "1.25rem" }}
            >
               current assignments
            </h4>

            {assigned.length === 0 ? (
              <div
                 className="card p-3 rounded-4"
                style={{ backgroundColor: "var(--color-card)" }}
              >
                <p className="mb-0" style={{ color: "rgba(229, 212, 184, 0.8)" }}>
                   no orders are assigned yet
                </p>
              </div>
            ) : (
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
                        <th>status</th>
                         <th>courier</th>
                        <th>reassign courier</th>
                      </tr>
                    </thead>

                    <tbody>
                      {assigned.map((item) => (
                        <tr key={item.orderId || item.id}>
                          <td className="fw-bold" style={{ color: "var(--color-orange)" }}>
                             #{item.orderId || item.id}
                          </td>
                          <td style={{ color: "var(--color-beige)" }}>{item.pickup}</td>
                           <td style={{ color: "var(--color-beige)" }}>{item.dropoff}</td>
                          <td><StatusBadge status={item.status} /></td>
                          <td style={{ color: "var(--color-beige)" }}>
                             courier #{item.courierId || item.courierid}
                          </td>
                           <td>{picker(item.orderId || item.id, "reassign")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}

export default CourierAssignments
