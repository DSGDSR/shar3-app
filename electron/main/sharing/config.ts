import { BrowserWindow } from "electron";
import { Settings } from "../../../shared";

const http = require('http');

export default { 
    debug: false,
    ssl: {
        protocolModule: http,
        protocol: 'http',
        option: {}
    },
    portfinder: {
        port: 7478,
        stopPort: 8000
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