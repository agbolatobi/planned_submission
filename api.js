const express = require('express')
const multer = require('multer')
const sqlite3 = require('sqlite3')
const path = require('path')
const cors = require('cors')

const app = express()
const port = 4001
const db = new sqlite3.Database('memories.db')

// WARNING: This CORS configuration allows all origins, methods, and headers.
// This is only for development purposes and should NOT be used in production.
// In production, you should configure CORS to only allow specific origins, methods, and headers.
app.use(cors())

app.use(express.json())

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    // Rename the file to avoid conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
})

const upload = multer({ storage })

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      image_url TEXT,
      memory_lane_id INTEGER,
      timestamp DATE
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS memory_lane (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      user_id INTEGER
    )
    `)
    db.run(`
      CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT
      )
      `) 
      db.run(`
        CREATE TABLE IF NOT EXISTS memory_lane_share (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          memory_lane_id INTEGER,
          has_viewed INTEGER
        )
        `)
})

// Create User Endpoint
app.post('/user', (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({
      error: 'Please Provide You Email'
    })
  }

  db.get('SELECT * FROM user WHERE email = ? LIMIT 1', [email], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    
    if (row) {
      return res.status(400).json({ error: email + " Already Exists" })
    }

    const stmt = db.prepare('INSERT INTO user (email) VALUES (?)')
    stmt.run(email, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.status(201).json({ message: 'User created successfully' })
    })
  })
})

//Retrieve User With Email
app.get('/user', (req, res) => {
  const {email} = req.query
  db.get('SELECT * FROM user WHERE email = ? LIMIT 1', [email], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    if (!row) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    res.json(row )
  })
})
// Get All Users
app.get('/user/all', (req, res) => {
  db.all('SELECT * FROM user', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    if (!rows) {
      res.json({ users: [] })
      return
    }
    res.json({ users: rows })
  })
})

// Get Memory Lanes For Users
app.get('/memory_lane/:user_id', (req, res) => {
  const { user_id } = req.params
  db.all('SELECT * FROM memory_lane WHERE user_id = ?', [user_id], (err, rows) => {
    if(!rows){
      res.json({ memory_lanes: []})
    }
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ memory_lanes: rows })
  })
})

// Get Memories With Memory Lane ID
app.get('/memories/:memory_lane_id', (req, res) => {
  const { memory_lane_id } = req.params
  db.all('SELECT * FROM memories WHERE memory_lane_id = ?', [memory_lane_id], (err, rows) => {
    if(!rows){
      res.json({ memory_lanes: []})
    }
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ memory_lanes: rows })
  })
})

//Create Memory with Image
app.post('/memories', upload.single('file'), (req, res) => {
  const { name, description, timestamp, memory_lane_id } = req.body
  const { path } = req.file

  if (!name || !description || !timestamp || !memory_lane_id, !path) {
    res.status(400).json({
      error: 'Please provide all fields: name, description, timestamp, memory_lane_id, file',
    })
    return
  }

  const stmt = db.prepare(
    'INSERT INTO memories (name, description, image_url, memory_lane_id, timestamp) VALUES (?, ?, ? ,? , ?)'
  )
  stmt.run(name, description, path, memory_lane_id, timestamp, (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.status(201).json({ message: 'Memory created successfully' })
  })
})


app.post('/memory_lane', (req, res) => {
  const { user_id, name } = req.body
  if (!user_id || !name) {
    res.status(400).json({
      error: 'Please provide all fields: name, user_id',
    })
    return
  }

  const stmt = db.prepare('INSERT INTO memory_lane (user_id, name) VALUES (?, ?)')

  stmt.run(user_id, name, (err) => {
    if (err) {
      res.status(500).json({error: err.message})
      return
    }
    res.status(201).json({message: 'Memory Lane Created Successfully'})
  })

})
// Share Memory Lane
app.post('/memory_lane_share', (req, res) => {
  const { user_id, memory_lane_id } = req.body
  if (!user_id || !memory_lane_id) {
    res.status(400).json({
      error: 'Please provide all fields: memory_lane_id, user_id',
    })
    return
  }

  // First check if share already exists
  db.get(
    'SELECT * FROM memory_lane_share WHERE user_id = ? AND memory_lane_id = ?',
    [user_id, memory_lane_id],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }

      if (row) {
        // Update existing share
        const updateStmt = db.prepare(
          'UPDATE memory_lane_share SET has_viewed = ? WHERE user_id = ? AND memory_lane_id = ?'
        )
        updateStmt.run(0, user_id, memory_lane_id, (err) => {
          if (err) {
            res.status(500).json({ error: err.message })
            return
          }
          res.json({ message: 'Memory Lane Share updated successfully' })
        })
      } else {
        // Create new share
        const insertStmt = db.prepare(
          'INSERT INTO memory_lane_share (user_id, memory_lane_id, has_viewed) VALUES (?, ?, ?)'
        )
        insertStmt.run(user_id, memory_lane_id, 0, (err) => {
          if (err) {
            res.status(500).json({ error: err.message })
            return
          }
          res.status(201).json({ message: 'Memory Lane Shared Successfully' })
        })
      }
    }
  )
})

//Register Memory Lane View
app.put('/memory_lane_share/view/:id', (req, res) => {
  const { id } = req.params
  const { has_viewed } = req.body

  if (!has_viewed) {
    res.status(400).json({
      error: 'Please provide all fields: name, description, timestamp',
    })
    return
  }

  const stmt = db.prepare(
    'UPDATE memory_lane_share SET has_viewed = ? WHERE id = ?'
  )
  stmt.run(has_viewed, id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ message: 'Memory Lane Share updated successfully' })
  })
})

app.get('/memory_lane_share/:user_id', (req, res) => {
  const { user_id } = req.params

  db.get('SELECT * FROM memory_lane_share WHERE user_id = ?', [user_id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    if (!rows) {
      res.json({memory_lanes: []})
      return
    }
    if(typeof rows === 'object'){
    res.json({ memory_lanes: [rows] })
    }else{
      res.json({ memory_lanes: rows })
    }
  })
})

app.get('/memory_lane/share/:id', (req, res) => {
  const { id } = req.params

  db.get('SELECT * FROM memory_lane WHERE id = ? LIMIT 1', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    if (!row) {
      res.status(404).json({ error: 'Memory lane not found' })
      return
    }
    res.json({ memory_lane: row })
  })
})


app.get('/memories/:id', (req, res) => {
  const { id } = req.params
  db.get('SELECT * FROM memories WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    if (!row) {
      res.status(404).json({ error: 'Memory not found' })
      return
    }
    res.json({ memory: row })
  })
})

app.put('/memories/:id', (req, res) => {
  const { id } = req.params
  const { name, description, timestamp } = req.body

  if (!name || !description || !timestamp) {
    res.status(400).json({
      error: 'Please provide all fields: name, description, timestamp',
    })
    return
  }

  const stmt = db.prepare(
    'UPDATE memories SET name = ?, description = ?, timestamp = ? WHERE id = ?'
  )
  stmt.run(name, description, timestamp, id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ message: 'Memory updated successfully' })
  })
})

app.delete('/memories/:id', (req, res) => {
  const { id } = req.params
  db.run('DELETE FROM memories WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ message: 'Memory deleted successfully' })
  })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
