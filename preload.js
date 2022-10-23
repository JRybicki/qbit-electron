const { contextBridge, ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const type of ['chrome', 'node', 'electron']) {
      replaceText(`${type}-version`, process.versions[type])
    }
  })

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle')
})

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateVersions: (callback) => ipcRenderer.on('update-versions', callback),
  onUpdateBytes: (callback) => ipcRenderer.on('update-bytes', callback),
})