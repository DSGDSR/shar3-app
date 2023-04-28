import { Settings, ShareEvents } from "../../../shared"
import config from "./config"
import { BrowserWindow, IpcMainInvokeEvent, dialog, ipcMain, shell } from 'electron'
const os = require('node:os')
const portfinder = require('portfinder')
const express = require('express')
const serveIndex = require('serve-index')
const basicAuth = require('express-basic-auth');
const fs = require('fs');
const tunnelmole = import('tunnelmole');

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
    const port = await portfinder.getPortPromise(config.portfinder)
    const settings = await config.getUserSettings(window)

    const app = express()

    // Add auth if configured
    setAuthMiddleware(app, settings)

    if (fs.lstatSync(path).isDirectory() ) {
        app.use('/', express.static(path), serveIndex(path, { 'icons': true }))
    } else {
        app.get('/', (req, res) =>  res.sendFile(path))
    }
    server = app.listen(port)

    let url;
    if (settings.publicShare) {
        const tunnelUrl = await (await tunnelmole).tunnelmole({ port })
        url = `${tunnelUrl}?timeToken=${Date.now()}`
    } else {
        url = `http://${getLocalAddress()}:${port}?timeToken=${Date.now()}`
    }

    event.sender.send(ShareEvents.SendShareUrl, url)
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

export default (window: BrowserWindow) => {
    ipcMain.handle(ShareEvents.OpenExplorer, (event) => openExplorer(window, event))
    ipcMain.handle(ShareEvents.StopSharing, closeServer)
    ipcMain.handle(ShareEvents.ShareDirectory, (event, path) => startServer(event, path, window))
    ipcMain.handle('open-link', (_event, url: string) => shell.openExternal(url))
}