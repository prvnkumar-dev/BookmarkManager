import express from 'express'
import mongoose from 'mongoose'
import Bookmark from '../models/Bookmark.js'

const router = express.Router()

function serialize(doc) {
  const obj = doc.toObject({ getters: true, versionKey: false })
  obj.id = obj._id?.toString()
  delete obj._id
  return obj
}

router.get('/', async (req, res) => {
  try {
    const items = await Bookmark.find().sort({ createdAt: -1 })
    res.json(items.map(serialize))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch bookmarks', details: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const bm = new Bookmark(req.body)
    const saved = await bm.save()
    res.status(201).json(serialize(saved))
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: 'Failed to create bookmark', details: err.message })
  }
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid id' })
  }
  try {
    const updated = await Bookmark.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    if (!updated) return res.status(404).json({ error: 'Bookmark not found' })
    res.json(serialize(updated))
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: 'Failed to update bookmark', details: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid id' })
  }
  try {
    const deleted = await Bookmark.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ error: 'Bookmark not found' })
    res.json({ message: 'Deleted', id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete bookmark', details: err.message })
  }
})

export default router
