export enum UpdaterEvents {
    StartDownload = 'start-download',
    CheckingForUpdate = 'checking-for-update',
    CheckUpdate = 'check-update',
    QuitAndInstall = 'quit-and-install',
    UpdateAvailable = 'update-available',
    UpdateCanAvailable = 'update-can-available',
    UpdateNotAvailable = 'update-not-available',
    UpdateError = 'update-error',
    DownloadProgress = 'download-progress',
    UpdateDownloaded = 'update-downloaded',
}