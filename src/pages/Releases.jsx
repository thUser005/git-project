import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { listReleases, createRelease } from '../api/github'

export default function Releases() {
  const { owner, name } = useParams()
  const [releases, setReleases] = useState([])
  const [form, setForm] = useState({ tag_name: '', name: '', body: '', prerelease: false })
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const load = async () => {
    setLoading(true)
    setReleases(await listReleases(owner, name))
    setLoading(false)
  }
  useEffect(()=>{ load() }, [owner, name])

  const create = async () => {
    setCreating(true)
    try {
      await createRelease(owner, name, form)
      await load()
      setForm({ tag_name: '', name: '', body: '', prerelease: false })
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
            <h5 className="mb-0">Releases</h5>
          </div>

          <div className="card mb-3">
            <div className="card-body">
              <div className="row g-2">
                <div className="col-md-3">
                  <label className="form-label">Tag</label>
                  <input className="form-control" value={form.tag_name} onChange={(e)=>setForm({...form, tag_name: e.target.value})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Name</label>
                  <input className="form-control" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} />
                </div>
                <div className="col-md-12">
                  <label className="form-label">Notes</label>
                  <textarea className="form-control" rows={3} value={form.body} onChange={(e)=>setForm({...form, body: e.target.value})}></textarea>
                </div>
                <div className="col-md-12 form-check">
                  <input className="form-check-input" type="checkbox" checked={form.prerelease} onChange={(e)=>setForm({...form, prerelease: e.target.checked})} id="pre" />
                  <label className="form-check-label" htmlFor="pre">Prerelease</label>
                </div>
                <div className="col-md-12 text-end">
                  <button className="btn btn-primary" onClick={create} disabled={creating || !form.tag_name}>{creating?'Publishing...':'Publish Release'}</button>
                </div>
              </div>
            </div>
          </div>

          {loading ? <div className="text-muted">Loading releases...</div> : (
            <ul className="list-group">
              {releases.map(rel => (
                <li key={rel.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold">{rel.tag_name} — {rel.name}</div>
                    <div className="small text-muted">{rel.author.login}</div>
                  </div>
                  <a className="btn btn-sm btn-outline-secondary" href={rel.html_url} target="_blank" rel="noreferrer">Open</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
