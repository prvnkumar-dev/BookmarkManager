import mongoose from 'mongoose'

const { Schema, model } = mongoose

const bookmarkSchema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
})

export default model('Bookmark', bookmarkSchema)
