import { Link, useLocation } from 'react-router-dom'
import { Github, FolderTree, GitBranch, GitPullRequest, GitCommit, Tag, Bug } from 'lucide-react'

export default function TopNav() {
  const { pathname } = useLocation()
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <Github size={20} className="me-2" /> <span>GitHub PAT Studio</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbars" aria-controls="navbars" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbars">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${pathname==='/'?'active':''}`} to="/">Repos</Link>
            </li>
          </ul>
          <span className="navbar-text text-light small">Client-side demo • Uses PAT from <code>.env.local</code></span>
        </div>
      </div>
    </nav>
  )
}
