import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bookmarksRouter from './routes/bookmarks.js'
import seedIfEmpty from './seed.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/bookmarks', bookmarksRouter)

app.get('/', (req, res) => res.json({ status: 'ok' }))

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/bookmarksdb'
const PORT = process.env.PORT || 4000

mongoose.connect(MONGO, { autoIndex: true }).then(async () => {
  console.log('Connected to MongoDB')
  await seedIfEmpty()
  app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))
}).catch(err => {
  console.error('Mongo connection error', err)
  process.exit(1)
})
