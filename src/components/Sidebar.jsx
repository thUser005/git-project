import { Link, useParams } from 'react-router-dom'
import { FolderTree, GitBranch, GitPullRequest, Bug, Tag } from 'lucide-react'

export default function Sidebar() {
  const { owner, name } = useParams()
  const base = `/repo/${owner}/${name}`
  return (
    <div className="sidebar border-end bg-white">
      <div className="list-group list-group-flush">
        <Link className="list-group-item list-group-item-action d-flex align-items-center" to={`${base}`}>
          <FolderTree size={18} className="me-2"/> Explorer
        </Link>
        <Link className="list-group-item list-group-item-action d-flex align-items-center" to={`${base}/branches`}>
          <GitBranch size={18} className="me-2"/> Branches
        </Link>
        <Link className="list-group-item list-group-item-action d-flex align-items-center" to={`${base}/pulls`}>
          <GitPullRequest size={18} className="me-2"/> Pull Requests
        </Link>
        <Link className="list-group-item list-group-item-action d-flex align-items-center" to={`${base}/issues`}>
          <Bug size={18} className="me-2"/> Issues
        </Link>
        <Link className="list-group-item list-group-item-action d-flex align-items-center" to={`${base}/releases`}>
          <Tag size={18} className="me-2"/> Releases
        </Link>
      </div>
    </div>
  )
}
