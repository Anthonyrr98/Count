const { app, BrowserWindow } = require('electron');
const path = require('path');

// 保持对窗口对象的全局引用
let mainWindow;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false // 允许加载本地文件
    }
  });

  // 加载应用的index.html
  mainWindow.loadFile('index.html');

  // 当开发时使用，打开开发者工具
  // mainWindow.webContents.openDevTools();

  // 当窗口关闭时发出的事件
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

// 当Electron完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(() => {
  createWindow();
  
  // 在macOS上，当点击dock图标且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口
  app.on('activate', function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 当所有窗口关闭时退出应用
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit();
}); 