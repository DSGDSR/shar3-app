import { Settings, ShareEvents } from "../../../shared"
import config from "./config"
import { BrowserWindow, IpcMainInvokeEvent, ipcMain } from 'electron'
const os = require('node:os')
const portfinder = require('portfinder')
const express = require('express')
const serveIndex = require('serve-index')
const basicAuth = require('express-basic-auth');
const ngrok = require('ngrok');

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
    ngrok.disconnect()
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

    app.use('/', express.static(path), serveIndex(path, { 'icons': true }))
    server = app.listen(port)

    let url;
    if (settings.publicShare) {
        url = `${await ngrok.connect({ addr: port, authtoken: import.meta.env.VITE_NGROK_API_TOKEN })}?timeToken=${Date.now()}`
    } else {
        url = `http://${getLocalAddress()}:${port}?timeToken=${Date.now()}`
    }

    event.sender.send(ShareEvents.SendShareUrl, url)
}

export default (window: BrowserWindow) => {
    ipcMain.handle(ShareEvents.StopSharing, closeServer)

    ipcMain.handle(ShareEvents.ShareDirectory, (event, path) => startServer(event, path, window))
}