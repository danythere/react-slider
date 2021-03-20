"use strict";

// Модули для управления приложением и создания окна
var _require = require('electron'),
    app = _require.app,
    BrowserWindow = _require.BrowserWindow,
    dialog = _require.dialog,
    ipcMain = _require.ipcMain;

var path = require('path');

var fs = require('fs');

function createWindow() {
  // Создаем окно браузера.
  var mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.webContents.openDevTools();
  mainWindow.loadURL('http://localhost:3000');
} // Этот метод вызывается когда приложение инициализируется
// и будет готово для создания окон.
// Некоторые API могут использоваться только после возникновения этого события.


app.whenReady().then(function () {
  createWindow();
  app.on('activate', function () {
    // На MacOS обычно пересоздают окно в приложении,
    // после того, как на иконку в доке нажали и других открытых окон нету.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
}); // Выйти когда все окна закрыты

app.on('window-all-closed', function () {
  // Для приложений и строки меню в macOS является обычным делом оставаться
  // активными до тех пор, пока пользователь не выйдет окончательно используя Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});
ipcMain.on("chooseFiles", function (event) {
  var fileSelectionPromise = dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{
      name: 'Images',
      extensions: ['png', 'jpg', 'bmp', 'jpeg', 'gif', 'tiff']
    }]
  });
  fileSelectionPromise.then(function (obj) {
    var dirContent = fs.readdirSync(path.dirname(obj.filePaths[0]), {
      withFileTypes: true
    });
    var files = [];
    dirContent.forEach(function (filePath) {
      var fullPath = path.join(path.dirname(obj.filePaths[0]), filePath.name);
      var extname = path.extname(filePath.name);
      if (fs.statSync(fullPath).isFile() && (extname === '.bmp' || extname === '.png' || extname === '.gif' || extname === '.tiff' || extname === '.jpeg' || extname === '.jpg')) files.push(fullPath);
    });
    event.reply('chooseFiles', files);
  });
});