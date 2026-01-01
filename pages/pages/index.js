import { useEffect, useState } from 'react'
import EntryForm from '../src/components/EntryForm'
import EntryList from '../src/components/EntryList'

const STORAGE_KEY = 'diary1.entries.v1'

export default function Home() {
  const [entries, setEntries] = useState([])
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setEntries(JSON.parse(raw))
    } catch (e) {
      console.error('Failed to load entries', e)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch (e) {
      console.error('Failed to save entries', e)
    }
  }, [entries])

  function addEntry(entry) {
    setEntries(prev => [{ ...entry, id: Date.now() }, ...prev])
  }

  function updateEntry(updated) {
    setEntries(prev => prev.map(e => (e.id === updated.id ? updated : e)))
    setEditing(null)
  }

  function deleteEntry(id) {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div className="container">
      <div className="header">
        <div className="brand">diary1</div>
        <div style={{ color: 'var(--muted)', marginLeft: '8px' }}>
          Private diary — stored in your browser
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <EntryForm
            onAdd={addEntry}
            onUpdate={updateEntry}
            editing={editing}
            onCancel={() => setEditing(null)}
          />
        </div>

        <div>
          <div className="card">
            <EntryList
              entries={entries}
              onEdit={e => setEditing(e)}
              onDelete={deleteEntry}
              onReplaceAll={setEntries}
            />
          </div>
          <div className="footer">
            Tip: entries live in your browser localStorage. Use Export to back up.
          </div>
        </div>
      </div>
    </div>
  )
}
