import { useState } from 'react'
import { createOrUpdateFile, b64encode } from '../api/github'

export default function CreateFileModal({ owner, repo, currentPath, branch, onCreated }) {
  const [relPath, setRelPath] = useState('new-file.txt')
  const [content, setContent] = useState('')
  const [message, setMessage] = useState('Create new file via PAT Studio')
  const [creating, setCreating] = useState(false)

  const create = async () => {
    setCreating(true)
    try {
      const fullPath = currentPath ? `${currentPath.replace(/\/$/, '')}/${relPath}` : relPath
      const res = await createOrUpdateFile(owner, repo, fullPath, {
        message,
        contentB64: b64encode(content),
        branch,
      })
      onCreated && onCreated(res)
      // Close modal programmatically
      document.getElementById('createFileClose').click()
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="modal fade" id="createFileModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New File</h5>
            <button id="createFileClose" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="mb-2">
              <label className="form-label">Relative path (inside current folder)</label>
              <input className="form-control" value={relPath} onChange={(e)=>setRelPath(e.target.value)} placeholder="dir/subdir/file.txt" />
            </div>
            <div className="mb-2">
              <label className="form-label">Initial content</label>
              <textarea className="form-control" rows={10} value={content} onChange={(e)=>setContent(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Commit message</label>
              <input className="form-control" value={message} onChange={(e)=>setMessage(e.target.value)} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" className="btn btn-primary" onClick={create} disabled={creating}>{creating?'Creating...':'Create file'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
