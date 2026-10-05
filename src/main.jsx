import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({ immediate: true })
const checkForUpdate = () => navigator.serviceWorker?.getRegistration().then((r) => r?.update())
// iOS standalone apps are rarely reloaded, so re-check when returning to the app
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') checkForUpdate()
})
navigator.serviceWorker?.addEventListener('controllerchange', () => {
  if (!sessionStorage.getItem('sw-reloaded')) {
    sessionStorage.setItem('sw-reloaded', '1')
    window.location.reload()
  }
})
setInterval(checkForUpdate, 60 * 60 * 1000)
void updateSW
