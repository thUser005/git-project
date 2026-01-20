import { useEffect, useMemo, useState } from 'react'
import { getAuthUser, listRepos, createRepo } from '../api/github'
import RepoCard from '../components/RepoCard'
import Loading from '../components/Loading'
import { Plus } from 'lucide-react'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(()=>{
    const init = async () => {
      try {
        const me = await getAuthUser()
        setUser(me)
        const rs = await listRepos()
        setRepos(rs)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const filtered = useMemo(()=>{
    const term = q.toLowerCase()
    return repos.filter(r => r.full_name.toLowerCase().includes(term))
  }, [q, repos])

  const [newRepo, setNewRepo] = useState({ name: '', description: '', privateRepo: false })
  const [creating, setCreating] = useState(false)

  const doCreateRepo = async () => {
    setCreating(true)
    try {
      const res = await createRepo(newRepo)
      setRepos([res, ...repos])
      setNewRepo({ name: '', description: '', privateRepo: false })
      document.getElementById('closeCreateRepo').click()
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="mb-0">Your Repositories</h4>
          <div className="text-muted small">{user ? `Signed in as ${user.login}` : '...'}</div>
        </div>
        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createRepoModal"><Plus size={18} className="me-1"/> New Repository</button>
      </div>

      <div className="input-group mb-3">
        <span className="input-group-text">Search</span>
        <input className="form-control" placeholder="Filter repos by name..." value={q} onChange={(e)=>setQ(e.target.value)} />
      </div>

      {loading && <Loading label="Loading repositories..." />}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3">
        {filtered.map(r => (
          <div className="col-12 col-md-6 col-lg-4" key={r.id}>
            <RepoCard repo={r} />
          </div>
        ))}
      </div>

      {/* Create Repo Modal */}
      <div className="modal fade" id="createRepoModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create Repository</h5>
              <button id="closeCreateRepo" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-2">
                <label className="form-label">Name</label>
                <input className="form-control" value={newRepo.name} onChange={(e)=>setNewRepo({...newRepo, name: e.target.value})} />
              </div>
              <div className="mb-2">
                <label className="form-label">Description</label>
                <textarea className="form-control" value={newRepo.description} onChange={(e)=>setNewRepo({...newRepo, description: e.target.value})}></textarea>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" checked={newRepo.privateRepo} onChange={(e)=>setNewRepo({...newRepo, privateRepo: e.target.checked})} id="repoPrivate" />
                <label className="form-check-label" htmlFor="repoPrivate">Private</label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button className="btn btn-primary" onClick={doCreateRepo} disabled={creating || !newRepo.name}>
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
