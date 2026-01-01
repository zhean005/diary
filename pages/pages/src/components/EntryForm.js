import { useEffect, useState } from 'react'

export default function EntryForm({ onAdd, editing, onUpdate, onCancel }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tags, setTags] = useState('')

  useEffect(() => {
    if (editing) {
      setTitle(editing.title || '')
      setBody(editing.body || '')
      setTags((editing.tags || []).join(', '))
    } else {
      setTitle('')
      setBody('')
      setTags('')
    }
  }, [editing])

  function submit(e) {
    e.preventDefault()
    const entry = {
      title: title.trim() || 'Untitled',
      body: body.trim(),
      tags: tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
      updatedAt: new Date().toISOString()
    }
    if (editing) {
      onUpdate({ ...editing, ...entry })
    } else {
      onAdd({ ...entry, createdAt: new Date().toISOString() })
    }
    setTitle('')
    setBody('')
    setTags('')
  }

  return (
    <form onSubmit={submit}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontWeight: 700 }}>New Entry</div>
        {editing && <div className="small">Editing</div>}
      </div>

      <div className="form-row">
        <input
          className="input"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>

      <div className="form-row">
        <textarea
          className="input"
          placeholder="Write your thoughts..."
          value={body}
          onChange={e => setBody(e.target.value)}
        />
      </div>

      <div className="form-row">
        <input
          className="input"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" className="button">
          {editing ? 'Save' : 'Add entry'}
        </button>
        {editing ? (
          <button type="button" className="small" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  )
}
