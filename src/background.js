import { app, protocol, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'
import path from 'path'
import os from 'os'
import * as pty from 'node-pty'
import Database from 'better-sqlite3'
import fs from 'fs'

protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true, supportFetchAPI: true } }
])

let mainWindow = null
let ptyProcessObj = {}
let db
async function createMainWindow() {
    // 禁止程序多开
    if (!app.requestSingleInstanceLock()) {
        app.quit()
        return
    }

    mainWindow = new BrowserWindow({
        title: 'Coast',
        center: true,
        width: 1200,
        height: 600,
        minWidth: 720,
        minHeight: 440,
        resizable: true,
        maximizable: true,
        autoHideMenuBar: true,
        useContentSize: true,
        titleBarStyle: 'hidden',
        trafficLightPosition: { x: 10, y: 18 },
        titleBarOverlay: { color: '#fff', symbolColor: '#797b88', height: 50 },
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
        handleExit()
        for (let key in ptyProcessObj) {
            let ptyProcess = ptyProcessObj[key]
            ptyProcess.kill()
        }
    })
    createDatabaseDir()
}

function createDatabaseDir() {
    console.log(app.getPath('userData'))
    const databasePath = path.join(app.getPath('userData'), 'database')
    if (!fs.existsSync(databasePath)) {
        fs.mkdirSync(databasePath, { recursive: true })
    }
    db = new Database(path.join(databasePath, 'schema.db'), {
        verbose: console.log
    })
    db.pragma('journal_mode = WAL')
    try {
        db.exec(
            `CREATE TABLE snippet (
                id integer primary key AUTOINCREMENT,
                name text,
                script text,
                targets text,
                create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                upodate_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )`
        )
    } catch (error) {
        console.log(error)
    }
    try {
        db.exec(
            `CREATE TABLE session (
                id integer primary key AUTOINCREMENT,
                label text,
                tags text,
                protocol text,
                host text,
                port integer,
                username text,
                password text,
                variable text,
                create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                upodate_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )`
        )
    } catch (error) {
        console.log(error)
    }
}

function handleExit() {
    try {
        db.close()
        console.log('Database connection closed gracefully.')
    } catch (error) {
        console.error('Error closing database:', error.message)
    }
}

ipcMain.handle('db_all', async (event, query, params = []) => {
    const stmt = db.prepare(query)
    return stmt.all(params)
})

ipcMain.handle('db_get', async (event, query, params = []) => {
    const stmt = db.prepare(query)
    return stmt.get(params)
})

ipcMain.handle('db_insert', async (event, query, params = []) => {
    const stmt = db.prepare(query)
    return stmt.run(params)
})

ipcMain.handle('db_update', async (event, query, params = []) => {
    const stmt = db.prepare(query)
    return stmt.run(params)
})

ipcMain.handle('db_delete', async (event, query, params = []) => {
    const stmt = db.prepare(query)
    return stmt.run(params)
})

ipcMain.handle('terminal', async (event, name, rows, cols) => {
    let ptyProcess = ptyProcessObj[name]
    if (ptyProcess) {
        ptyProcess.kill()
    }
    let env = process.env
    env.LANG = 'en_US.UTF-8'
    const shell = os.platform() === 'win32' ? 'powershell.exe' : os.platform() === 'darwin' ? 'zsh' : 'bash'
    ptyProcess = pty.spawn(shell, [os.platform() === 'win32' ? '' : '--login'], {
        name: 'xterm-256color',
        rows: rows,
        cols: cols,
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

ipcMain.handle('resize', async (event, name, rows, cols) => {
    let ptyProcess = ptyProcessObj[name]
    ptyProcess.resize(cols, rows)
})

ipcMain.handle('setTitleBarOverlay', async (event, color) => {
    mainWindow.setTitleBarOverlay({ color: color })
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
