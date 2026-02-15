import mongoose from 'mongoose'

const { Schema } = mongoose

const bookmarkSchema = new Schema({
  url: { type: String, required: true },
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, maxlength: 500 },
  tags: {
    type: [String],
    validate: [arr => arr.length <= 5, 'No more than 5 tags'],
    default: []
  },
  createdAt: { type: Date, default: Date.now }
})

bookmarkSchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})

export default mongoose.model('Bookmark', bookmarkSchema)
