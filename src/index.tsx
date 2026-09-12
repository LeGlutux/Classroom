import React from 'react'
import ReactDOM from 'react-dom'
import './tailwind.css'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { listenForInstallPrompt } from './components/InstallApp'
import { markNativeShell } from './native'

markNativeShell()
listenForInstallPrompt()

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
)

serviceWorker.register()
