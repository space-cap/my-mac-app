import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('marketApi', {
  getSnapshot() {
    return ipcRenderer.invoke('market:get-snapshot')
  },
})
