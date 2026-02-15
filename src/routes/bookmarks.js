import express from 'express'
import mongoose from 'mongoose'
import Bookmark from '../models/bookmark.js'

const router = express.Router()

function isValidUrl(u) {
  try {
    new URL(u)
    return true
  } catch {
    return false
  }
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id)
}

router.get('/', async (req, res) => {
  try {
    const filter = {}
    if (req.query.tag) filter.tags = req.query.tag.toLowerCase()
    const bookmarks = await Bookmark.find(filter).sort({ createdAt: -1 }).lean()
    return res.json(bookmarks)
  } catch (err) {
    console.error('Get error:', err.message)
    return res.status(500).json({ error: 'Server error', details: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { url, title, description, tags } = req.body
    if (!url || !title) return res.status(400).json({ error: 'url and title are required' })
    if (!isValidUrl(url)) return res.status(400).json({ error: 'Invalid URL' })
    if (title.length > 200) return res.status(400).json({ error: 'Title too long' })
    if (description && description.length > 500) return res.status(400).json({ error: 'Description too long' })
    let normalizedTags = []
    if (Array.isArray(tags)) {
      normalizedTags = tags.slice(0, 5).map(t => String(t).toLowerCase())
    }
    const bm = new Bookmark({ url, title, description, tags: normalizedTags })
    await bm.save()
    return res.status(201).json(bm.toJSON())
  } catch (err) {
    console.error('Create error:', err.message)
    return res.status(500).json({ error: 'Server error', details: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid bookmark ID' })
    }
    
    const { url, title, description, tags } = req.body
    const update = {}
    
    if (url !== undefined) {
      if (!isValidUrl(url)) return res.status(400).json({ error: 'Invalid URL' })
      update.url = url
    }
    if (title !== undefined) {
      if (!title) return res.status(400).json({ error: 'title is required' })
      if (title.length > 200) return res.status(400).json({ error: 'Title too long' })
      update.title = title
    }
    if (description !== undefined) {
      if (description && description.length > 500) return res.status(400).json({ error: 'Description too long' })
      update.description = description
    }
    if (tags !== undefined) {
      if (!Array.isArray(tags)) return res.status(400).json({ error: 'tags must be an array' })
      update.tags = tags.slice(0, 5).map(t => String(t).toLowerCase())
    }
    
    const bm = await Bookmark.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean()
    if (!bm) return res.status(404).json({ error: 'Bookmark not found' })
    return res.json(bm)
  } catch (err) {
    console.error('Update error:', err.message)
    return res.status(500).json({ error: 'Server error', details: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid bookmark ID' })
    }
    
    const bm = await Bookmark.findByIdAndDelete(id).lean()
    if (!bm) return res.status(404).json({ error: 'Bookmark not found' })
    return res.json({ success: true, message: 'Bookmark deleted' })
  } catch (err) {
    console.error('Delete error:', err.message)
    return res.status(500).json({ error: 'Server error', details: err.message })
  }
})

export default router
