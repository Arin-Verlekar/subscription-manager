import { useEffect, useState } from "react"
import "./App.css"

function App() {

  const [subscriptions, setSubscriptions] = useState([])

  const [service, setService] = useState("")
  const [price, setPrice] = useState("")
  const [dueDate, setDueDate] = useState("")

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {

    const response = await fetch(
      "http://localhost:5000/subscriptions"
    )

    const data = await response.json()

    setSubscriptions(data)
  }

  const addSubscription = async () => {

    if (!service || !price || !dueDate) {
      alert("Please fill all fields")
      return
    }

    const response = await fetch(
      "http://localhost:5000/subscriptions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          service,
          price,
          dueDate
        })
      }
    )

    const newSubscription = await response.json()

    setSubscriptions([
      ...subscriptions,
      newSubscription
    ])

    setService("")
    setPrice("")
    setDueDate("")
  }

  const deleteSubscription = async (id) => {

    await fetch(
      `http://localhost:5000/subscriptions/${id}`,
      {
        method: "DELETE"
      }
    )

    setSubscriptions(
      subscriptions.filter(
        (sub) => sub.id !== id
      )
    )
  }

  const totalAmount = subscriptions.reduce(
    (total, sub) => total + Number(sub.price),
    0
  )

  const getDaysLeft = (date) => {

    const today = new Date()

    const due = new Date(date)

    const difference =
      due - today

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    )
  }

  return (

    <div className="app">

      <div className="dashboard">

        <div className="header">

          <h1>
            Subscription Dashboard
          </h1>

          <p>
            Track all your monthly subscriptions
          </p>

        </div>

        <div className="stats">

          <div className="stat-card">

            <h2>
              {subscriptions.length}
            </h2>

            <p>
              Active Subscriptions
            </p>

          </div>

          <div className="stat-card">

            <h2>
              ₹ {totalAmount}
            </h2>

            <p>
              Total Monthly Spend
            </p>

          </div>

        </div>

        <div className="add-card">

          <h3>
            Add Subscription
          </h3>

          <div className="form-container">

            <input
              type="text"
              placeholder="Netflix, Spotify..."
              value={service}
              onChange={(e) =>
                setService(e.target.value)
              }
            />

            <input
              type="number"
              placeholder="Monthly Price"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
            />

            <input
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(e.target.value)
              }
            />

            <button onClick={addSubscription}>
              Add
            </button>

          </div>

        </div>

        <div className="cards-container">

          {subscriptions.map((sub) => {

            const daysLeft =
              getDaysLeft(sub.dueDate)

            return (

              <div
                className="subscription-card"
                key={sub.id}
              >

                <div className="card-top">

                  <div className="logo-circle">
                    {sub.service.charAt(0)}
                  </div>

                  <div>

                    <h2>
                      {sub.service}
                    </h2>

                    <p>
                      Monthly Subscription
                    </p>

                  </div>

                </div>

                <div className="price">
                  ₹ {sub.price}
                </div>

                <div className="due-date">
                  Due: {sub.dueDate}
                </div>

                <div
                  className={
                    daysLeft <= 0
                      ? "status overdue"
                      : daysLeft <= 3
                      ? "status warning"
                      : "status safe"
                  }
                >

                  {
                    daysLeft <= 0
                      ? "Overdue"
                      : `Due in ${daysLeft} days`
                  }

                </div>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteSubscription(sub.id)
                  }
                >
                  Remove
                </button>

              </div>
            )
          })}

        </div>

      </div>

    </div>
  )
}

export default App