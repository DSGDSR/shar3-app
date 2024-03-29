import { Settings, ShareEvents } from "../../../../../dist/libs/shared"
import config from "./config"
import { BrowserWindow, IpcMainInvokeEvent, dialog, ipcMain, shell } from 'electron'
const os = require('node:os')
const findFreePorts = require('find-free-ports');
const express = require('express')
const serveIndex = require('serve-index')
const basicAuth = require('express-basic-auth')
const fs = require('fs')

let server;

const getLocalAddress = (): string => {
    // TODO any interface
    for (const interfaceDetails of Object.values<any>(os.networkInterfaces())) {
        if (!interfaceDetails)
            continue
        for (const details of interfaceDetails) {
            const { address, family, internal } = details
            if (family === "IPv4" && !internal)
                return address
        }
    }
}

const setAuthMiddleware = (app: any, settings: Settings): void => {
    if (settings?.auth?.enabled && settings?.auth?.username && settings?.auth?.password) {
        app.use(basicAuth({
            challenge: true,
            realm: 'sharing',
            users: { [settings.auth.username]: settings.auth.password }
        }));
    }
}

const closeServer = (): void => {
    server?.close((err) => {
        if (err) {
            console.log('Error closing server: ' + err)
        }
    })
}

const startServer = async (event: IpcMainInvokeEvent, path: string, window: BrowserWindow): Promise<void> => {
    const [port] = await findFreePorts()
    const settings = await config.getUserSettings(window)
    let isDirectory = false

    const app = express()

    // Add auth if configured
    setAuthMiddleware(app, settings)

    if (fs.lstatSync(path).isDirectory()) {
        app.use('/', express.static(path), serveIndex(path, { 'icons': true }))
        isDirectory = true
    } else {
        app.get('/', (req, res) => res.sendFile(path))
    }
    server = app.listen(port)

    let url;
    if (settings.publicShare) {
        //WIN url = `${await (await import('ngrok')).disconnect()
        //WIN url = `${await (await import('ngrok')).connect({ addr: port, authtoken: import.meta.env.VITE_NGROK_API_TOKEN })}?timeToken=${Date.now()}`
        
        /*MAC*/ const tunnelUrl = await (await import('tunnelmole')).tunnelmole({ port })
        /*MAC*/ url = `${tunnelUrl}?timeToken=${Date.now()}`
    } else {
        url = `http://${getLocalAddress()}:${port}?timeToken=${Date.now()}`
    }

    event.sender.send(ShareEvents.SendShareUrl, path, url, isDirectory)
}

const openExplorer = (window: BrowserWindow, event: IpcMainInvokeEvent) => {
    dialog.showOpenDialog(window, {
        properties: ['openFile', 'openDirectory']
    }).then((uploadEvent) => {
        event.sender.send(ShareEvents.SelectPath, uploadEvent)
    }).catch(() => {
        // TODO error
    })
}

const openFolder = (path: string) => {
    if (fs.lstatSync(path).isDirectory()) {
        shell.openPath(path)
    } else {
        shell.showItemInFolder(path)
    }
}

export default (window: BrowserWindow) => {
    ipcMain.handle(ShareEvents.OpenExplorer, (event) => openExplorer(window, event))
    ipcMain.handle(ShareEvents.StopSharing, closeServer)
    ipcMain.handle(ShareEvents.ShareDirectory, (event, path) => startServer(event, path, window))
    ipcMain.handle('open-link', (_event, url: string) => shell.openExternal(url))
    ipcMain.handle(ShareEvents.OpenFolder, (_, path: string) => openFolder(path))
    ipcMain.handle(ShareEvents.ReportBug, () => shell.openExternal("https://github.com/DSGDSR/shar3-app/issues/new")) //"mailto:contact@dsgdsr.me?subject=[Shar3]%20Bug%20found&body="
}