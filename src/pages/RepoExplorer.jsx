import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import FileTree from '../components/FileTree'
import FileEditor from '../components/FileEditor'
import Breadcrumbs from '../components/Breadcrumbs'
import { deleteFile, getAuthUser, listBranches } from '../api/github'
import CreateFileModal from '../components/CreateFileModal'

export default function RepoExplorer() {
  const { owner, name } = useParams()
  const [currentPath, setCurrentPath] = useState('')
  const [selectedFile, setSelectedFile] = useState('')
  const [branches, setBranches] = useState([])
  const [branch, setBranch] = useState('')
  const [me, setMe] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(()=>{
    const init = async () => {
      const b = await listBranches(owner, name)
      setBranches(b)
      setBranch(b?.[0]?.name || '')
      const m = await getAuthUser()
      setMe(m)
    }
    init()
  }, [owner, name])

  const parts = useMemo(()=> currentPath ? currentPath.split('/') : [], [currentPath])

  const onNavigate = (path) => { setSelectedFile(''); setCurrentPath(path) }
  const onSelectFile = (path) => { setSelectedFile(path) }

  const onDeleteRequested = async (item) => {
    if (!confirm(`Delete file ${item.path}?`)) return
    setDeleting(true)
    try {
      await deleteFile(owner, name, item.path, {
        message: `Delete ${item.name} via PAT Studio`,
        sha: item.sha,
        branch,
      })
      // Refresh the view
      if (selectedFile === item.path) setSelectedFile('')
      setCurrentPath(prev => prev + '') // trigger reload
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="container-fluid">
      <div className="row g-0">
        <div className="col-12 col-lg-3">
          <Sidebar />
        </div>
        <div className="col-12 col-lg-9 p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <h5 className="mb-0">{owner}/{name}</h5>
              <div className="small text-muted">Signed in: {me?.login}</div>
            </div>
            <div className="d-flex align-items-center">
              <label className="me-2 small text-muted">Branch</label>
              <select className="form-select form-select-sm" style={{width: 200}} value={branch} onChange={(e)=>{setBranch(e.target.value)}}>
                {branches.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
              </select>
            </div>
          </div>

          <Breadcrumbs parts={parts} onNavigate={(p)=>{ setCurrentPath(p); setSelectedFile('') }} />

          <div className="row g-3">
            <div className="col-12 col-xl-4">
              <FileTree owner={owner} repo={name} path={currentPath} onNavigate={onNavigate} onSelectFile={onSelectFile}
                onCreateRequested={() => { const m = new bootstrap.Modal('#createFileModal'); m.show() }}
                onDeleteRequested={onDeleteRequested}
              />
              {deleting && <div className="text-danger small mt-2">Deleting...</div>}
            </div>
            <div className="col-12 col-xl-8">
              <FileEditor owner={owner} repo={name} filePath={selectedFile} branch={branch} onSaved={()=>{}} />
            </div>
          </div>
        </div>
      </div>

      <CreateFileModal owner={owner} repo={name} currentPath={currentPath} branch={branch} onCreated={()=>{ /* reload tree */ setCurrentPath(p=>p+'') }} />
    </div>
  )
}
