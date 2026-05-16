const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()

const app = express()

app.use(cors())
app.use(express.json())

const db = new sqlite3.Database('./server/database.db')

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      price INTEGER,
      renewal TEXT,
      category TEXT
    )
  `)
})

app.get('/', (req, res) => {
  res.send('Backend is running 🚀')
})

app.get('/subscriptions', (req, res) => {
  db.all('SELECT * FROM subscriptions', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }

    res.json(rows)
  })
})

app.post('/subscriptions', (req, res) => {
  const { name, price, renewal, category } = req.body

  db.run(
    `
    INSERT INTO subscriptions (name, price, renewal, category)
    VALUES (?, ?, ?, ?)
    `,
    [name, price, renewal, category],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }

      res.json({
        id: this.lastID,
        name,
        price,
        renewal,
        category,
      })
    }
  )
})

app.delete('/subscriptions/:id', (req, res) => {
  const id = req.params.id

  db.run(
    'DELETE FROM subscriptions WHERE id = ?',
    [id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }

      res.json({ message: 'Subscription deleted' })
    }
  )
})

app.listen(5000, () => {
  console.log('Server running on port 5000')
})