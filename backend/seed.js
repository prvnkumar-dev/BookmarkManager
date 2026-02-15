import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Bookmark from './models/Bookmark.js'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bookmarks'

async function seed() {
  await mongoose.connect(MONGO_URI)
  const count = await Bookmark.countDocuments()
  if (count > 0) {
    console.log('Database already seeded; skipping.')
    process.exit(0)
  }
  const data = [
    {
      title: 'Example Bookmark',
      url: 'https://example.com',
      tags: ['example', 'seed']
    }
  ]
  await Bookmark.insertMany(data)
  console.log('Seed complete')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
