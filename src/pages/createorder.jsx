import { useState } from "react"
import { orderapi } from "../api"

// time slots
const slots = [
  { value: "09:00", label: "9 AM - 12 PM" },
   { 
     value: "12:00", 
     label: "12 PM - 3 PM" 
   },
  { value: "15:00", label: "3 PM - 6 PM" },
   { value: "18:00", label: "6 PM - 9 PM" }
] ;

function CreateOrder() 
{
  const [pickup, setPickup] = useState("")
   const [dropoff, setDropoff] = useState("") ;
  const [details, setDetails] = useState("")
   const [deliverytime, setDeliverytime] = useState("") ;

  const [date, setDate] = useState("") ;
   const [slot, setSlot] = useState(slots[0].value) ;

  const [error, setError] = useState("")
   const [done, setDone] = useState("") ;


  function changedate(value) {
     setDate(value) ;
      setDeliverytime(value ? `${value}T${slot}` : "")
  }

  function changeslot(value) 
  {
    setSlot(value) ;
     setDeliverytime(date ? `${date}T${value}` : "") ;
  }


  async function submit(e) 
  {
     e.preventDefault() ;
     setError("") ;
     setDone("")

    try {
       await orderapi.post("/orders", { pickup, dropoff, details, deliverytime }) ;

        setDone("order created successfully") ;

       setPickup("") ;
        setDropoff("")
       setDetails("") ;
        setDeliverytime("")
       setDate("")
        setSlot(slots[0].value) ;

    } 
    catch (err) {
        setError(err.response?.data?.message || "failed to create order") ;
    }
  }


  return (
    <div
       className="d-flex justify-content-center align-items-start py-5 px-3 min-vh-100"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="w-100" style={{ maxWidth: "720px" }}>

        <h2 className="fw-bold mb-1" style={{ color: "var(--color-beige)", fontSize: "2rem" }}>
          create new order
        </h2>

         <p className="mb-4" style={{ color: "rgba(229, 212, 184, 0.75)" }}>
          enter the package and destination details below
         </p>


        <form
           onSubmit={submit}
          className="rounded-4 p-4 p-md-5 shadow-sm"
          style={{
             backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-card-border)"
          }}
        >
          {error && <div className="alert alert-danger py-2 mb-3 rounded-3">{error}</div>}
           {done && <div className="alert alert-success py-2 mb-3 rounded-3">{done}</div>}


          <h5 className="fw-bold mb-3" style={{ color: "var(--color-beige)" }}>locations</h5>

          <div className="row g-3 mb-4">
             <div className="col-12 col-md-6">
              <label className="form-label fw-semibold small" style={{ color: "var(--color-beige)" }}>
                pickup address
              </label>
              <textarea
                 className="form-control rounded-3 p-3"
                rows="2"
                placeholder="street, area, city"
                value={pickup}
                 onChange={(e) => setPickup(e.target.value)}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold small" style={{ color: "var(--color-beige)" }}>
                 drop-off address
              </label>
              <textarea
                className="form-control rounded-3 p-3"
                 rows="2"
                placeholder="street, area, city"
                value={dropoff}
                 onChange={(e) => setDropoff(e.target.value)}
                required
              />
            </div>
          </div>


          <h5 className="fw-bold mb-3" style={{ color: "var(--color-beige)" }}>package details</h5>

          <div className="mb-4">
            <label className="form-label fw-semibold small" style={{ color: "var(--color-beige)" }}>
               description & notes
            </label>
            <textarea
               className="form-control rounded-3 p-3"
              rows="3"
               placeholder="package size, fragility, or courier notes"
              value={details}
               onChange={(e) => setDetails(e.target.value)}
              required
            />
          </div>


          <h5 className="fw-bold mb-3" style={{ color: "var(--color-beige)" }}>delivery schedule</h5>

          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold small" style={{ color: "var(--color-beige)" }}>
                 preferred date
              </label>
              <input
                type="date"
                 className="form-control rounded-3 p-3"
                value={date}
                 onChange={(e) => changedate(e.target.value)}
                required
              />
            </div>

             <div className="col-12 col-md-6">
              <label className="form-label fw-semibold small" style={{ color: "var(--color-beige)" }}>
                time window
              </label>
              <select
                 className="form-select rounded-3 p-3"
                value={slot}
                 onChange={(e) => changeslot(e.target.value)}
              >
                {slots.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>


          <button
            type="submit"
             className="btn btn-lg w-100 rounded-3 fw-bold mt-2"
            style={{
              backgroundColor: "var(--color-orange)",
               color: "#ffffff",
              border: "none",
               padding: "14px"
            }}
          >
             submit order
          </button>
        </form>

      </div>
    </div>
  )
}

export default CreateOrder
