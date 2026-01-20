import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { listIssues, createIssue } from '../api/github'

export default function Issues() {
  const { owner, name } = useParams()
  const [issues, setIssues] = useState([])
  const [form, setForm] = useState({ title: '', body: '' })
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const load = async () => {
    setLoading(true)
    const list = await listIssues(owner, name)
    setIssues(list)
    setLoading(false)
  }
  useEffect(()=>{ load() }, [owner, name])

  const create = async () => {
    setCreating(true)
    try {
      await createIssue(owner, name, form)
      await load()
      setForm({ title: '', body: '' })
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
            <h5 className="mb-0">Issues</h5>
          </div>

          <div className="card mb-3">
            <div className="card-body">
              <div className="row g-2">
                <div className="col-md-5">
                  <label className="form-label">Title</label>
                  <input className="form-control" value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} />
                </div>
                <div className="col-md-12">
                  <label className="form-label">Body</label>
                  <textarea className="form-control" rows={3} value={form.body} onChange={(e)=>setForm({...form, body: e.target.value})}></textarea>
                </div>
                <div className="col-md-12 text-end">
                  <button className="btn btn-primary" onClick={create} disabled={creating || !form.title}>{creating?'Creating...':'Create Issue'}</button>
                </div>
              </div>
            </div>
          </div>

          {loading ? <div className="text-muted">Loading issues...</div> : (
            <ul className="list-group">
              {issues.map(is => (
                <li key={is.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold">#{is.number} {is.title}</div>
                    <div className="small text-muted">{is.user.login} • {is.state}</div>
                  </div>
                  <a className="btn btn-sm btn-outline-secondary" href={is.html_url} target="_blank" rel="noreferrer">Open</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
