import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { listPulls, createPull } from '../api/github'

export default function PullRequests() {
  const { owner, name } = useParams()
  const [pulls, setPulls] = useState([])
  const [form, setForm] = useState({ title: '', head: '', base: 'main', body: '' })
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const load = async () => {
    setLoading(true)
    const ps = await listPulls(owner, name)
    setPulls(ps)
    setLoading(false)
  }
  useEffect(()=>{ load() }, [owner, name])

  const create = async () => {
    setCreating(true)
    try {
      await createPull(owner, name, form)
      await load()
      setForm({ title: '', head: '', base: 'main', body: '' })
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
            <h5 className="mb-0">Pull Requests</h5>
          </div>

          <div className="card mb-3">
            <div className="card-body">
              <div className="row g-2">
                <div className="col-md-4">
                  <label className="form-label">Title</label>
                  <input className="form-control" value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">From (head)</label>
                  <input className="form-control" placeholder="user:branch" value={form.head} onChange={(e)=>setForm({...form, head: e.target.value})} />
                </div>
                <div className="col-md-2">
                  <label className="form-label">To (base)</label>
                  <input className="form-control" value={form.base} onChange={(e)=>setForm({...form, base: e.target.value})} />
                </div>
                <div className="col-md-12">
                  <label className="form-label">Body</label>
                  <textarea className="form-control" rows={3} value={form.body} onChange={(e)=>setForm({...form, body: e.target.value})}></textarea>
                </div>
                <div className="col-md-12 text-end">
                  <button className="btn btn-primary" onClick={create} disabled={creating || !form.title || !form.head}>{creating?'Creating...':'Create PR'}</button>
                </div>
              </div>
            </div>
          </div>

          {loading ? <div className="text-muted">Loading PRs...</div> : (
            <ul className="list-group">
              {pulls.map(pr => (
                <li key={pr.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold">#{pr.number} {pr.title}</div>
                    <div className="small text-muted">{pr.user.login} opened · {pr.head.ref} → {pr.base.ref}</div>
                  </div>
                  <a className="btn btn-sm btn-outline-secondary" href={pr.html_url} target="_blank" rel="noreferrer">View on GitHub</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
