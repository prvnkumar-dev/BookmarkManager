# Bookmark API Guide

Your backend is now fully configured with MongoDB for all CRUD operations. Here's how to use it:

## Base URL
```
http://localhost:4000/bookmarks
```

---

## 1. GET ALL BOOKMARKS
Fetch all bookmarks from MongoDB

**Request:**
```bash
GET /bookmarks
```

**Example:**
```javascript
fetch('http://localhost:4000/bookmarks')
  .then(res => res.json())
  .then(data => console.log(data))
```

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "url": "https://react.dev",
    "title": "React",
    "description": "The React documentation",
    "tags": ["javascript", "library"],
    "createdAt": "2026-02-15T10:30:00.000Z"
  }
]
```

---

## 2. GET BOOKMARKS BY TAG
Filter bookmarks by a specific tag

**Request:**
```bash
GET /bookmarks?tag=javascript
```

**Example:**
```javascript
fetch('http://localhost:4000/bookmarks?tag=javascript')
  .then(res => res.json())
  .then(data => console.log(data))
```

---

## 3. CREATE NEW BOOKMARK
Add a new bookmark to MongoDB

**Request:**
```bash
POST /bookmarks
Content-Type: application/json

{
  "url": "https://nodejs.org",
  "title": "Node.js",
  "description": "JavaScript runtime built on Chrome's V8",
  "tags": ["javascript", "runtime"]
}
```

**Example:**
```javascript
fetch('http://localhost:4000/bookmarks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://nodejs.org',
    title: 'Node.js',
    description: 'JavaScript runtime built on Chrome\'s V8',
    tags: ['javascript', 'runtime']
  })
})
  .then(res => res.json())
  .then(data => console.log(data))
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439012",
  "url": "https://nodejs.org",
  "title": "Node.js",
  "description": "JavaScript runtime built on Chrome's V8",
  "tags": ["javascript", "runtime"],
  "createdAt": "2026-02-15T10:35:00.000Z"
}
```

---

## 4. UPDATE BOOKMARK
Modify an existing bookmark in MongoDB

**Request:**
```bash
PUT /bookmarks/{id}
Content-Type: application/json

{
  "title": "Node.js (Updated)",
  "description": "Updated description",
  "tags": ["javascript", "server", "backend"]
}
```

**Example:**
```javascript
const bookmarkId = '507f1f77bcf86cd799439012';

fetch(`http://localhost:4000/bookmarks/${bookmarkId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Node.js (Updated)',
    description: 'Updated description',
    tags: ['javascript', 'server', 'backend']
  })
})
  .then(res => res.json())
  .then(data => console.log(data))
```

**Note:** You can update any of these fields:
- `url` - Must be a valid URL
- `title` - Max 200 characters (required)
- `description` - Max 500 characters
- `tags` - Array with max 5 tags

---

## 5. DELETE BOOKMARK
Remove a bookmark from MongoDB

**Request:**
```bash
DELETE /bookmarks/{id}
```

**Example:**
```javascript
const bookmarkId = '507f1f77bcf86cd799439012';

fetch(`http://localhost:4000/bookmarks/${bookmarkId}`, {
  method: 'DELETE'
})
  .then(res => res.json())
  .then(data => console.log(data))
```

**Response:**
```json
{
  "success": true,
  "message": "Bookmark deleted"
}
```

---

## Key Points

✅ **All data is stored in MongoDB** - Not in seed.js anymore
✅ **seed.js only creates initial bookmarks** - Only runs if database is empty
✅ **Full CRUD support** - Create, Read, Update, Delete operations
✅ **ID format** - Use the `id` field from responses (it's the MongoDB ObjectId)
✅ **Validation** - Proper error messages for invalid requests

---

## Testing with cURL

### Get all bookmarks
```bash
curl http://localhost:4000/bookmarks
```

### Create a bookmark
```bash
curl -X POST http://localhost:4000/bookmarks \
  -H "Content-Type: application/json" \
  -d '{"url":"https://test.com","title":"Test","tags":["test"]}'
```

### Update a bookmark
```bash
curl -X PUT http://localhost:4000/bookmarks/507f1f77bcf86cd799439012 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'
```

### Delete a bookmark
```bash
curl -X DELETE http://localhost:4000/bookmarks/507f1f77bcf86cd799439012
```
