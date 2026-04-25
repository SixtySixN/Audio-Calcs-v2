const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

function getPackagedBuildLabel() {
    if (!app.isPackaged) {
        return '';
    }

    try {
        const buildInfoPath = path.join(app.getAppPath(), 'build-info.json');
        const raw = fs.readFileSync(buildInfoPath, 'utf8');
        const parsed = JSON.parse(raw);
        return typeof parsed.label === 'string' ? parsed.label : '';
    } catch {
        return '';
    }
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 1200,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.setMenuBarVisibility(false);
 //   win.webContents.openDevTools();
    const buildLabel = getPackagedBuildLabel();
    const query = buildLabel ? { buildLabel } : {};
    win.loadFile(path.join(__dirname, 'index.html'), { query });
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});