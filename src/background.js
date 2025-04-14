import { app, protocol, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'
import path from 'path'
import os from 'os'
import * as pty from 'node-pty'

protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true, supportFetchAPI: true } }
])

let mainWindow = null
let ptyProcessObj = {}
async function createMainWindow() {
    // 禁止程序多开
    if (!app.requestSingleInstanceLock()) {
        app.quit()
        return
    }

    mainWindow = new BrowserWindow({
        title: 'Coast',
        center: true,
        width: 800,
        height: 506,
        resizable: false,
        maximizable: true,
        autoHideMenuBar: true,
        useContentSize: true,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) mainWindow.webContents.openDevTools()
    } else {
        createProtocol('app')
        mainWindow.loadURL('app://./index.html')
    }

    mainWindow.on('close', event => {
        event.preventDefault()
        for (let key in ptyProcessObj) {
            let ptyProcess = ptyProcessObj[key]
            ptyProcess.kill()
        }
    })
}

ipcMain.handle('terminal', async (event, name) => {
    let ptyProcess = ptyProcessObj[name]
    if (ptyProcess) {
        ptyProcess.kill()
    }
    let env = process.env
    env.LANG = 'en_US.UTF-8'
    const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL']
    ptyProcess = pty.spawn(shell, ['--login'], {
        name: 'xterm-256color',
        cwd: process.env.USERPROFILE || process.env.HOME,
        env: env
    })
    ptyProcess.on('data', data => {
        mainWindow.webContents.send('terminal', name, data)
    })
    ptyProcess.on('exit', code => ptyProcessExit(code, name))
    ptyProcessObj[name] = ptyProcess
})

ipcMain.handle('write', async (event, name, data) => {
    let ptyProcess = ptyProcessObj[name]
    ptyProcess.write(data)
})

ipcMain.handle('dispose', async (event, name) => {
    let ptyProcess = ptyProcessObj[name]
    ptyProcess.kill()
})

function ptyProcessExit(code, name) {
    delete ptyProcessObj[name]
    if (Object.keys(ptyProcessObj).length === 0) {
        mainWindow.destroy()
    }
}

// 当运行第二个实例时，将会聚焦到win这个窗口
app.on('second-instance', () => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        if (mainWindow.isVisible()) {
            mainWindow.focus()
        } else {
            mainWindow.show()
            mainWindow.setSkipTaskbar(false)
        }
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow()
    } else {
        mainWindow.show()
    }
})

app.on('ready', async () => {
    await createMainWindow()
})

if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', data => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}
