import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { listBranches, getRef, createBranch } from '../api/github'

export default function Branches() {
  const { owner, name } = useParams()
  const [branches, setBranches] = useState([])
  const [newBranch, setNewBranch] = useState('feature/new-branch')
  const [from, setFrom] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const load = async () => {
    setLoading(true)
    const bs = await listBranches(owner, name)
    setBranches(bs)
    setFrom(bs?.[0]?.name || '')
    setLoading(false)
  }
  useEffect(()=>{ load() }, [owner, name])

  const create = async () => {
    setCreating(true)
    try {
      const fromRef = await getRef(owner, name, `heads/${from}`)
      await createBranch(owner, name, newBranch, fromRef.object.sha)
      await load()
      setNewBranch('feature/new-branch')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="container-fluid">
      <div className="row g-0">
        <div className="col-12 col-lg-3"><Sidebar /></div>
        <div className="col-12 col-lg-9 p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Branches</h5>
            <div className="d-flex">
              <input className="form-control form-control-sm me-2" style={{width: 240}} value={newBranch} onChange={(e)=>setNewBranch(e.target.value)} placeholder="new-branch-name" />
              <select className="form-select form-select-sm me-2" style={{width: 180}} value={from} onChange={(e)=>setFrom(e.target.value)}>
                {branches.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
              </select>
              <button className="btn btn-sm btn-primary" onClick={create} disabled={creating || !newBranch}>{creating?'Creating...':'Create Branch'}</button>
            </div>
          </div>
          {loading ? (
            <div className="text-muted">Loading branches...</div>
          ) : (
            <ul className="list-group">
              {branches.map(b => (
                <li key={b.name} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{b.name}</span>
                  <code className="small">{b.commit.sha.substring(0,7)}</code>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
