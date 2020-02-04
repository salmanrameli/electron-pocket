const path = require('path')

window.electron = {}
window.Store = require('electron').remote.require('electron-store')
window.electronObject = require('electron').electronObject
window.isDev = require('electron-is-dev')
window.ipcRenderer = require('electron').ipcRenderer