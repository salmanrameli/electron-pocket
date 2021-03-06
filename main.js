const { app, BrowserWindow } = require('electron')
const path = require('path')
const isDev = require("electron-is-dev");
const ipcMain = require('electron').ipcMain

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let authWindow
let articleWindow

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({
        width: 720,
        height: 960,
        webPreferences: {
            nodeIntegration: false,
            preload: path.resolve(`${__dirname}/public/renderer.js`),
        },
    })

    win.center()

    // and load the index.html of the app.
    win.loadURL(
        isDev ? "http://localhost:3000" : `file://${path.join(__dirname, '/build/index.html')}`
    )

    // Open the DevTools.
    win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

function openAuthWindow(request_token, redirect_uri) {
	authWindow = new BrowserWindow({
		width: 960,
		height: 640,
    });
    
    authWindow.center()

    authWindow.loadURL(`https://getpocket.com/auth/authorize?request_token=${request_token}&redirect_uri=${redirect_uri}`)
    
    authWindow.webContents.on('will-redirect', function(event, url) {
        app.relaunch()
	
	    app.exit(0)
    })

	authWindow.on('closed', function () {
		authWindow = null
	})
}

function openArticleWindow(resolved_url) {
    articleWindow = new BrowserWindow({
		width: 1280,
		height: 800,
    });
    
    articleWindow.center()

    articleWindow.loadURL(resolved_url)

	articleWindow.on('closed', function () {
		articleWindow = null
	})
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('open-auth-url', (event, request_token, redirect_uri) => {
    openAuthWindow(request_token, redirect_uri)
})

ipcMain.on('open-article', (event, resolved_url) => {
    openArticleWindow(resolved_url)
})