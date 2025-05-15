import React, { useState } from 'react'
import { fetchShortestPath } from '../api'

export default function ShortestPathForm({ users = [], onFind }) {
  const [source, setSource] = useState('')
  const [target, setTarget] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFind = async e => {
    e.preventDefault()
    setError(null)
    if (!source || !target) {
      setError('Both source & target IDs are required')
      return
    }
    setLoading(true)
    try {
      const data = await fetchShortestPath(source, target)
      onFind(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="form shortest-path-form" onSubmit={handleFind}>
      <h3>Shortest Path</h3>

      <select
        name="source"
        value={source}
        onChange={e => setSource(e.target.value)}
        required
      >
        <option value="">Select source user</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>
            {u.name} ({u.id})
          </option>
        ))}
      </select>

      <select
        name="target"
        value={target}
        onChange={e => setTarget(e.target.value)}
        required
      >
        <option value="">Select target user</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>
            {u.name} ({u.id})
          </option>
        ))}
      </select>

      <button type="submit" disabled={loading}>
        {loading ? 'Searching…' : 'Find Path'}
      </button>

      {error && <p style={{ color: 'crimson', marginTop: 8 }}>{error}</p>}
    </form>
  )
}
