import { useEffect, useState } from 'react'
import { getFile, createOrUpdateFile, b64decode, b64encode } from '../api/github'

export default function FileEditor({ owner, repo, filePath, branch, onSaved }) {
  const [text, setText] = useState('')
  const [sha, setSha] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('Update file via PAT Studio')

  useEffect(()=>{
    const load = async () => {
      if (!filePath) return
      setLoading(true)
      try {
        const file = await getFile(owner, repo, filePath, branch ? { ref: branch } : undefined)
        setSha(file.sha)
        setText(b64decode(file.content))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [owner, repo, filePath, branch])

  const save = async () => {
    setLoading(true)
    try {
      const res = await createOrUpdateFile(owner, repo, filePath, {
        message,
        contentB64: b64encode(text),
        sha,
        branch,
      })
      setSha(res.content.sha)
      onSaved && onSaved(res)
    } finally {
      setLoading(false)
    }
  }

  if (!filePath) return <div className="text-muted">Select a file to view/edit.</div>

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <div className="small text-muted">Editing</div>
            <div className="fw-semibold">{filePath}</div>
          </div>
          <div className="d-flex align-items-center">
            <input className="form-control form-control-sm me-2" value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Commit message" />
            <button className="btn btn-sm btn-primary" onClick={save} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
        <textarea className="form-control code-editor" rows={22} value={text} onChange={(e)=>setText(e.target.value)} spellCheck={false} />
      </div>
    </div>
  )
}
