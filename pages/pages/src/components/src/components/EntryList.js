import { useMemo, useState } from 'react'

export default function EntryList({ entries = [], onEdit, onDelete, onReplaceAll }) {
  const [query, setQuery] = useState('')
  const [tagFilter, setTagFilter] = useState('')

  const tags = useMemo(() => {
    const s = new Set()
    entries.forEach(e => (e.tags || []).forEach(t => s.add(t)))
    return Array.from(s).sort()
  }, [entries])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return entries.filter(e => {
      if (tagFilter && !(e.tags || []).includes(tagFilter)) return false
      if (!q) return true
      return (
        e.title.toLowerCase().includes(q) ||
        (e.body || '').toLowerCase().includes(q) ||
        (e.tags || []).join(' ').toLowerCase().includes(q)
      )
    })
  }, [entries, query, tagFilter])

  function exportJSON() {
    const data = JSON.stringify(entries, null, 2)
    download('diary-entries.json', data, 'application/json')
  }

  function exportMarkdown() {
    const md = entries
      .map(e => {
        const when = e.createdAt ? new Date(e.createdAt).toLocaleString() : ''
        const tags = (e.tags || []).map(t => `#${t}`).join(' ')
        return `## ${escapeMd(e.title)}\n\n_${when}_\n\n${escapeMd(e.body || '')}\n\n${tags}\n\n---`
      })
      .join('\n\n')
    download('diary-entries.md', md, 'text/markdown')
  }

  function importJSONFile(f) {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        if (Array.isArray(parsed)) {
          onReplaceAll(parsed)
        } else {
          alert('Invalid file format: expected JSON array')
        }
      } catch (e) {
        alert('Failed to parse JSON file')
      }
    }
    reader.readAsText(f)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          className="input"
          placeholder="Search title, body, tags..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <select
          className="input"
          value={tagFilter}
          onChange={e => setTagFilter(e.target.value)}
        >
          <option value="">All tags</option>
          {tags.map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        <button className="small" onClick={exportJSON}>Export JSON</button>
        <button className="small" onClick={exportMarkdown}>Export Markdown</button>
        <label className="small" style={{ cursor: 'pointer' }}>
          Import JSON
          <input
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={e => {
              if (e.target.files?.[0]) importJSONFile(e.target.files[0])
              e.target.value = ''
            }}
          />
        </label>
      </div>

      <div style={{ marginBottom: 12 }}>
        {filtered.length === 0 ? (
          <div className="empty">No entries yet. Write your first entry!</div>
        ) : (
          filtered.map(e => (
            <div className="entry" key={e.id || (e.createdAt + e.title)}>
              <div className="meta">
                <div style={{ fontWeight: 700 }}>{e.title}</div>
                <div style={{ color: 'var(--muted)', marginLeft: 8 }}>
                  {e.createdAt ? new Date(e.createdAt).toLocaleString() : ''}
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }} className="controls">
                  <button className="small" onClick={() => onEdit(e)}>Edit</button>
                  <button
                    className="small"
                    onClick={() => {
                      if (confirm('Delete this entry?')) onDelete(e.id)
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div style={{ marginBottom: 8, whiteSpace: 'pre-wrap' }}>{e.body}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(e.tags || []).map(t => (
                  <div className="tag" key={t}>{t}</div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function download(filename, data, type = 'text/plain') {
  const blob = new Blob([data], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function escapeMd(s = '') {
  return s.replace(/`/g, '\\`')
}
