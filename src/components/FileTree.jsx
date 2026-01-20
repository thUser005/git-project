import { useEffect, useState } from 'react'
import { listRepoPath } from '../api/github'
import { Folder, File, Trash2, Plus } from 'lucide-react'

export default function FileTree({ owner, repo, path, onNavigate, onSelectFile, onCreateRequested, onDeleteRequested }) {
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')

  const load = async () => {
    setError('')
    try {
      const data = await listRepoPath(owner, repo, path)
      const arr = Array.isArray(data) ? data : [data]
      // Directories first
      arr.sort((a,b)=> (a.type===b.type ? a.name.localeCompare(b.name) : (a.type==='dir'?-1:1)))
      setItems(arr)
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(()=>{ load() // eslint-disable-next-line
  }, [owner, repo, path])

  if (error) return <div className="alert alert-danger">{error}</div>
  if (!items) return <div className="text-muted small">Loading tree...</div>

  return (
    <div className="list-group">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="text-muted small">{items.length} item(s)</span>
        <div className="btn-group btn-group-sm">
          <button className="btn btn-outline-primary" onClick={onCreateRequested}><Plus size={16} className="me-1"/>New file</button>
        </div>
      </div>
      {items.map(it => (
        <button key={it.sha} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
          onClick={() => { if (it.type==='dir') onNavigate(it.path); else onSelectFile(it.path) }}>
          <div className="d-flex align-items-center">
            {it.type==='dir' ? <Folder size={18} className="text-warning"/> : <File size={18} className="text-secondary"/>}
            <span className="ms-2">{it.name}</span>
          </div>
          {it.type==='file' && (
            <button className="btn btn-sm btn-outline-danger" onClick={(e)=>{ e.stopPropagation(); onDeleteRequested(it) }}>
              <Trash2 size={16}/>
            </button>
          )}
        </button>
      ))}
    </div>
  )
}
