const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

let subscriptions = [
  {
    id: 1,
    service: "Netflix",
    price: 499,
    dueDate: "2026-05-25"
  },
  {
    id: 2,
    service: "Spotify",
    price: 119,
    dueDate: "2026-05-18"
  }
]

app.get("/subscriptions", (req, res) => {
  res.json(subscriptions)
})

app.post("/subscriptions", (req, res) => {

  const newSubscription = {
    id: subscriptions.length + 1,
    service: req.body.service,
    price: req.body.price,
    dueDate: req.body.dueDate
  }

  subscriptions.push(newSubscription)

  res.json(newSubscription)
})

app.delete("/subscriptions/:id", (req, res) => {

  const id =
    parseInt(req.params.id)

  subscriptions =
    subscriptions.filter(
      (sub) => sub.id !== id
    )

  res.json({
    success: true
  })
})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})