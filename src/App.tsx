import React, { useEffect, useMemo, useState } from 'react'
import './App.css'

type Bookmark = {
  id: string
  url: string
  title: string
  description?: string
  tags?: string[]
  createdAt?: string
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

function validateUrl(u: string) {
  try {
    // allow inputs like example.com by normalizing before validation
    const normalized = (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(u)) ? u : `https://${u}`
    const parsed = new URL(normalized)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function normalizeUrl(u: string) {
  if (!u) return u
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(u)) return u
  return `https://${u}`
}

export default function App() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(false)
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const [form, setForm] = useState({ url: '', title: '', description: '', tags: '' })
  const [editing, setEditing] = useState<Bookmark | null>(null)

  async function load(tag?: string) {
    setLoading(true)
    try {
      const qs = tag ? `?tag=${encodeURIComponent(tag)}` : ''
      const res = await fetch(`${API_BASE}/bookmarks${qs}`)
      const data = await res.json()
      // Normalize IDs: some responses may use `_id`, ensure `id` exists for the UI
      const normalized = (data || []).map((it: any) => ({ ...it, id: it.id ?? it._id }))
      setBookmarks(normalized)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleAdd(e?: React.FormEvent) {
    e?.preventDefault()
    if (!form.url || !form.title) return alert('URL and title required')
    if (!validateUrl(form.url)) return alert('Invalid URL')
    const payload = {
      url: normalizeUrl(form.url),
      title: form.title,
      description: form.description,
      tags: form.tags ? form.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : []
    }
    const res = await fetch(`${API_BASE}/bookmarks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (res.status === 201) {
      setForm({ url: '', title: '', description: '', tags: '' })
      load(filterTag || undefined)
    } else {
      const err = await res.json()
      alert(err.error || 'Failed')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this bookmark?')) return
    const res = await fetch(`${API_BASE}/bookmarks/${id}`, { method: 'DELETE' })
    if (res.ok) load(filterTag || undefined)
    else alert('Delete failed')
  }

  function openEdit(b: Bookmark) {
    setEditing(b)
    setForm({ url: b.url, title: b.title, description: b.description || '', tags: (b.tags || []).join(',') })
  }

  async function saveEdit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!editing) return
    if (!form.url || !form.title) return alert('URL and title required')
    if (!validateUrl(form.url)) return alert('Invalid URL')
    const payload = {
      url: normalizeUrl(form.url),
      title: form.title,
      description: form.description,
      tags: form.tags ? form.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : []
    }
    const res = await fetch(`${API_BASE}/bookmarks/${editing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (res.ok) {
      setEditing(null)
      setForm({ url: '', title: '', description: '', tags: '' })
      load(filterTag || undefined)
    } else {
      const err = await res.json()
      alert(err.error || 'Update failed')
    }
  }

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return bookmarks.filter(b => {
      if (filterTag && !(b.tags || []).includes(filterTag)) return false
      if (!q) return true
      return b.title.toLowerCase().includes(q) || b.url.toLowerCase().includes(q)
    })
  }, [bookmarks, filterTag, search])

  const allTags = useMemo(() => {
    const s = new Set<string>()
    bookmarks.forEach(b => (b.tags || []).forEach(t => s.add(t)))
    return Array.from(s)
  }, [bookmarks])

  return (
    <div className="app">
      <header>
        <h1>Bookmark Manager</h1>
        <div className="controls">
          <input placeholder="Search title or url" value={search} onChange={e => setSearch(e.target.value)} />
          {filterTag && <button onClick={() => { setFilterTag(null); load() }}>Clear filter</button>}
        </div>
      </header>

      <main>
        <section className="left">
          <form onSubmit={editing ? saveEdit : handleAdd} className="form">
            <h2>{editing ? 'Edit Bookmark' : 'Add Bookmark'}</h2>
            <input placeholder="URL" value={form.url} onChange={e => setForm(s => ({ ...s, url: e.target.value }))} />
            <input placeholder="Title" value={form.title} onChange={e => setForm(s => ({ ...s, title: e.target.value }))} />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm(s => ({ ...s, description: e.target.value }))} />
            <input placeholder="tags (comma separated)" value={form.tags} onChange={e => setForm(s => ({ ...s, tags: e.target.value }))} />
            <div className="form-actions">
              <button type="submit">{editing ? 'Save' : 'Add'}</button>
              {editing && <button type="button" onClick={() => { setEditing(null); setForm({ url: '', title: '', description: '', tags: '' }) }}>Cancel</button>}
            </div>
          </form>

          <div className="tags">
            <h3>Tags</h3>
            <div className="tag-list">
              {allTags.length === 0 && <div className="muted">No tags</div>}
              {allTags.map(t => (
                <button key={t} className={t === filterTag ? 'active' : ''} onClick={() => { setFilterTag(t); load(t) }}>{t}</button>
              ))}
            </div>
          </div>
        </section>

        <section className="right">
          <h2>Bookmarks {loading ? '(loading...)' : ''}</h2>
          <ul className="list">
            {visible.map(b => (
              <li key={b.id} className="item">
                <div className="top">
                  <a href={b.url} target="_blank" rel="noreferrer">{b.title}</a>
                  <div className="actions">
                    <button onClick={() => openEdit(b)}>Edit</button>
                    <button onClick={() => handleDelete(b.id)}>Delete</button>
                  </div>
                </div>
                <div className="url"><a href={b.url} target="_blank" rel="noreferrer">{b.url}</a></div>
                {b.description && <div className="desc">{b.description}</div>}
                <div className="tags-row">{(b.tags || []).map(t => <button key={t} onClick={() => { setFilterTag(t); load(t) }}>#{t}</button>)}</div>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer>
        <small>Backend: {API_BASE}</small>
      </footer>
    </div>
  )
}
