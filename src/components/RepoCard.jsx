import { Link } from 'react-router-dom'
import { Lock, Globe, GitBranch } from 'lucide-react'

export default function RepoCard({ repo }) {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="card-title mb-1">
              <Link to={`/repo/${repo.owner.login}/${repo.name}`} className="text-decoration-none">{repo.full_name}</Link>
            </h5>
            <p className="text-muted small mb-2">{repo.description || 'No description'}</p>
          </div>
          <span className="badge bg-light text-dark d-flex align-items-center">
            {repo.private ? <Lock size={14} className="me-1"/> : <Globe size={14} className="me-1"/>}
            {repo.private ? 'Private' : 'Public'}
          </span>
        </div>
        <div className="text-muted small d-flex align-items-center">
          <GitBranch size={14} className="me-1"/> Default branch: {repo.default_branch}
        </div>
      </div>
    </div>
  )
}
