import { BrowserWindow } from "electron"
import { Settings } from "../../../../../dist/libs/shared"

const http = require('http');

export default { 
    debug: false,
    ssl: {
        protocolModule: http,
        protocol: 'http',
        option: {}
    },
    getUserSettings: async (window: BrowserWindow): Promise<Settings> => {
        try {
            const saved = await window.webContents.executeJavaScript(`localStorage.getItem('settings')`)
            return saved ? JSON.parse(saved) : null
        } catch {
            return null
        }
    }
};