import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { API_BASE } from './config.js'

const nativeFetch = window.fetch.bind(window)
window.fetch = async (input, init = {}) => {
  const response = await nativeFetch(input, init)
  const url = typeof input === 'string' ? input : input?.url || ''
  const headers = init.headers || {}
  const hasAuth = !!(headers.Authorization || headers.authorization)
  if (response.status === 401 && hasAuth && url.startsWith(API_BASE) && localStorage.getItem('token')) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.reload()
  }
  return response
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
