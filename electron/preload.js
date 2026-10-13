const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Trading controls
  startAgent: () => ipcRenderer.send('start-agent'),
  pauseAgent: () => ipcRenderer.send('pause-agent'),
  emergencyStop: () => ipcRenderer.send('emergency-stop'),
  
  // Settings
  openSettings: () => ipcRenderer.send('open-settings'),
  
  // Event listeners
  onStartAgent: (callback) => ipcRenderer.on('start-agent', callback),
  onPauseAgent: (callback) => ipcRenderer.on('pause-agent', callback),
  onEmergencyStop: (callback) => ipcRenderer.on('emergency-stop', callback),
  onOpenSettings: (callback) => ipcRenderer.on('open-settings', callback),
  
  // App info
  getVersion: () => ipcRenderer.invoke('get-version'),
  getPlatform: () => process.platform,
  
  // File operations
  exportData: (data, filename) => ipcRenderer.invoke('export-data', data, filename),
  importData: (filename) => ipcRenderer.invoke('import-data', filename),
  
  // Notifications
  showNotification: (title, body) => {
    new Notification(title, { body });
  }
});

// Context isolation - prevent direct access to Node.js APIs
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});
