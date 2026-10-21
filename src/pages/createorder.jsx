import { useState } from "react"
import { orderapi } from "../api"

function CreateOrder() {
  const [pickup, setPickup] = useState("")
  const [dropoff, setDropoff] = useState("")
  const [details, setDetails] = useState("")
  const [deliverytime, setDeliverytime] = useState("")

  const [error, setError] = useState("")
  const [done, setDone] = useState("")

  async function submit(e) {
    e.preventDefault()
    setError("")
    setDone("")

    try {
      await orderapi.post("/orders", { pickup, dropoff, details, deliverytime })

      setDone("order created")

      setPickup("")
      setDropoff("")
      setDetails("")
      setDeliverytime("")

    } catch (err) {
       setError(err.response?.data?.message || "failed to create order")
    }
  }

  return (
    <div className="box">
      <h2>create order</h2>

      {error && <p className="error">{error}</p>}
      {done && <p className="done">{done}</p>}

      <form onSubmit={submit}>
        <input placeholder="pickup location" value={pickup} onChange={(e) => setPickup(e.target.value)} />

        <input placeholder="drop-off location" value={dropoff} onChange={(e) => setDropoff(e.target.value)} />

        <textarea placeholder="package details" value={details} onChange={(e) => setDetails(e.target.value)} />

        <label>delivery time</label>
        <input type="datetime-local" value={deliverytime} onChange={(e) => setDeliverytime(e.target.value)} />

        <button type="submit">create order</button>
      </form>
    </div>
  )
}

export default CreateOrder
