import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import TopNav from './components/TopNav'
import Dashboard from './pages/Dashboard'
import RepoExplorer from './pages/RepoExplorer'
import Branches from './pages/Branches'
import PullRequests from './pages/PullRequests'
import Issues from './pages/Issues'
import Releases from './pages/Releases'

export default function App() {
  return (
    <div className="d-flex flex-column" style={{minHeight: '100vh'}}>
      <TopNav />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/repo/:owner/:name/*" element={<RepoExplorer />} />
        <Route path="/repo/:owner/:name/branches" element={<Branches />} />
        <Route path="/repo/:owner/:name/pulls" element={<PullRequests />} />
        <Route path="/repo/:owner/:name/issues" element={<Issues />} />
        <Route path="/repo/:owner/:name/releases" element={<Releases />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
