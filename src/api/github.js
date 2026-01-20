import axios from 'axios'

export const getToken = () => {
  // Vite exposes only VITE_* vars. We also try PAT_TOKEN for convenience, but it won't be present unless injected.
  return (import.meta.env.VITE_PAT_TOKEN || import.meta.env.PAT_TOKEN || '').trim()
}

const gh = () => {
  const token = getToken()
  if (!token) throw new Error('Missing token. Set VITE_PAT_TOKEN in .env.local')
  return axios.create({
    baseURL: 'https://api.github.com',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github+json',
    },
  })
}

// Utility: Base64 helpers UTF-8 safe
export const b64encode = (str) => {
  return btoa(unescape(encodeURIComponent(str)))
}
export const b64decode = (b64) => {
  return decodeURIComponent(escape(atob(b64)))
}

// User and repos
export const getAuthUser = async () => (await gh().get('/user')).data
export const listRepos = async (params = { per_page: 100, sort: 'updated' }) => (await gh().get('/user/repos', { params })).data
export const createRepo = async ({ name, description = '', privateRepo = false }) => (
  await gh().post('/user/repos', { name, description, private: privateRepo })
).data

// Repo contents
export const listRepoPath = async (owner, repo, path = '') => (await gh().get(`/repos/${owner}/${repo}/contents/${path}`)).data
export const getFile = async (owner, repo, path, ref) => (await gh().get(`/repos/${owner}/${repo}/contents/${path}`, { params: ref ? { ref } : {} })).data
export const createOrUpdateFile = async (owner, repo, path, { message, contentB64, sha, branch }) => (
  await gh().put(`/repos/${owner}/${repo}/contents/${path}`, {
    message,
    content: contentB64,
    sha,
    branch,
  })
).data
export const deleteFile = async (owner, repo, path, { message, sha, branch }) => (
  await gh().delete(`/repos/${owner}/${repo}/contents/${path}`, {
    data: { message, sha, branch },
  })
).data

// Branches
export const listBranches = async (owner, repo) => (await gh().get(`/repos/${owner}/${repo}/branches`, { params: { per_page: 100 } })).data
export const getRef = async (owner, repo, ref) => (await gh().get(`/repos/${owner}/${repo}/git/ref/${ref}`)).data
export const createBranch = async (owner, repo, newBranch, fromSha) => (
  await gh().post(`/repos/${owner}/${repo}/git/refs`, { ref: `refs/heads/${newBranch}`, sha: fromSha })
).data

// Pull Requests
export const listPulls = async (owner, repo) => (await gh().get(`/repos/${owner}/${repo}/pulls`)).data
export const createPull = async (owner, repo, { title, head, base, body }) => (
  await gh().post(`/repos/${owner}/${repo}/pulls`, { title, head, base, body })
).data

// Issues
export const listIssues = async (owner, repo) => (await gh().get(`/repos/${owner}/${repo}/issues`, { params: { state: 'all' } })).data
export const createIssue = async (owner, repo, { title, body }) => (
  await gh().post(`/repos/${owner}/${repo}/issues`, { title, body })
).data

// Releases
export const listReleases = async (owner, repo) => (await gh().get(`/repos/${owner}/${repo}/releases`)).data
export const createRelease = async (owner, repo, { tag_name, name, body, draft = false, prerelease = false, target_commitish }) => (
  await gh().post(`/repos/${owner}/${repo}/releases`, { tag_name, name, body, draft, prerelease, target_commitish })
).data
