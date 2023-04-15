import { app, ipcMain } from 'electron'
import {
  type ProgressInfo,
  type UpdateDownloadedEvent,
  autoUpdater
} from 'electron-updater'
import { UpdaterEvents } from '../../shared'

export function update(win: Electron.BrowserWindow) {

  // When set to false, the update download will be triggered through the API
  autoUpdater.autoDownload = false
  autoUpdater.disableWebInstaller = false
  autoUpdater.allowDowngrade = false

  // start check
  autoUpdater.on(UpdaterEvents.CheckingForUpdate, () => { })
  // update available
  autoUpdater.on(UpdaterEvents.UpdateAvailable, (arg) => {
    win.webContents.send(UpdaterEvents.UpdateCanAvailable, { update: true, version: app.getVersion(), newVersion: arg?.version })
  })
  // update not available
  autoUpdater.on(UpdaterEvents.UpdateNotAvailable, (arg) => {
    win.webContents.send(UpdaterEvents.UpdateCanAvailable, { update: false, version: app.getVersion(), newVersion: arg?.version })
  })

  // Checking for updates
  ipcMain.handle(UpdaterEvents.CheckUpdate, async () => {
    if (!app.isPackaged) {
      const error = new Error('The update feature is only available after the package.')
      return { message: error.message, error }
    }

    try {
      return await autoUpdater.checkForUpdatesAndNotify()
    } catch (error) {
      return { message: 'Network error', error }
    }
  })

  // Start downloading and feedback on progress
  ipcMain.handle(UpdaterEvents.StartDownload, (event) => {
    startDownload(
      (error, progressInfo) => {
        if (error) {
          // feedback download error message
          event.sender.send(UpdaterEvents.UpdateError, { message: error.message, error })
        } else {
          // feedback update progress message
          event.sender.send(UpdaterEvents.DownloadProgress, progressInfo)
        }
      },
      () => {
        // feedback update downloaded message
        event.sender.send(UpdaterEvents.UpdateDownloaded)
      }
    )
  })

  // Install now
  ipcMain.handle(UpdaterEvents.QuitAndInstall, () => {
    autoUpdater.quitAndInstall(false, true)
  })
}

function startDownload(
  callback: (error: Error | null, info: ProgressInfo) => void,
  complete: (event: UpdateDownloadedEvent) => void,
) {
  autoUpdater.on(UpdaterEvents.DownloadProgress, info => callback(null, info))
  autoUpdater.on('error', error => callback(error, null))
  autoUpdater.on(UpdaterEvents.UpdateDownloaded, complete)
  autoUpdater.downloadUpdate()
}
