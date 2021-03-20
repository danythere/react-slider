// Модули для управления приложением и создания окна
const {
    app,
    BrowserWindow,
    dialog,
    ipcMain
} = require('electron')
const path = require('path');
const fs = require('fs');

function createWindow() {
    // Создаем окно браузера.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })
    mainWindow.webContents.openDevTools();
    mainWindow.loadURL('http://localhost:3000');
}

// Этот метод вызывается когда приложение инициализируется
// и будет готово для создания окон.
// Некоторые API могут использоваться только после возникновения этого события.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        // На MacOS обычно пересоздают окно в приложении,
        // после того, как на иконку в доке нажали и других открытых окон нету.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Выйти когда все окна закрыты
app.on('window-all-closed', function () {
    // Для приложений и строки меню в macOS является обычным делом оставаться
    // активными до тех пор, пока пользователь не выйдет окончательно используя Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on("chooseFiles", (event) => {
    let fileSelectionPromise = dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{
            name: 'Images',
            extensions: ['png', 'jpg', 'bmp', 'jpeg', 'gif', 'tiff']
        }]
    });
    fileSelectionPromise.then(function (obj) {
        let dirContent = fs.readdirSync(path.dirname(obj.filePaths[0]), {
            withFileTypes: true
        });
        const files = [];
        dirContent.forEach(filePath => {
            const fullPath = path.join(path.dirname(obj.filePaths[0]), filePath.name);
            const extname = path.extname(filePath.name);
            if (fs.statSync(fullPath).isFile() && (extname === '.bmp' || extname === '.png' || extname === '.gif' || extname === '.tiff' || extname === '.jpeg' || extname === '.jpg'))
                files.push(fullPath);
        });
        event.reply('chooseFiles', files)
    });
});