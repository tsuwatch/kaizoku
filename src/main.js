import {app} from 'electron';
import path from 'path';
import MainWindow from './browser/MainWindow';
import ApplicationMenu from './browser/ApplicationMenu';

class Main {
  constructor() {
    this.mainWindow = null;
  }

  loadFlashPlugin() {
    let pluginName;
    switch (process.platform) {
      case 'win32':
        pluginName = 'pepflashplayer.dll';
        break;
      case 'darwin':
        pluginName = 'PepperFlashPlayer.plugin';
        break;
      case 'linux':
        pluginName = 'libpepflashplayer.so';
        break;
    }
    app.commandLine.appendSwitch('ppapi-flash-path', `${path.join(__dirname)}/../plugins/${pluginName}`);
    app.commandLine.appendSwitch('ppapi-flash-version', '25.0.0.127')
  }

  onReady() {
    this.mainWindow = new MainWindow();
    this.mainWindow.createLoginModal();
    new ApplicationMenu(this.mainWindow.window);
  }

  onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }
}

const main = new Main();

main.loadFlashPlugin();

app.on('ready', () => {
  main.onReady();
});

app.on('window-all-closed', () => {
  main.onWindowAllClosed();
});
