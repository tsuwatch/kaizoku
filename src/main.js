import {app} from 'electron';
import path from 'path';
import Application from './browser/Application';

class Main {
  constructor() {
    this.application = null;
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

    const pluginDir = path.join(__dirname, process.env.NODE_ENV === 'development' ? '../' : '', 'plugins').replace('app.asar', 'app.asar.unpacked');
    app.commandLine.appendSwitch('ppapi-flash-path', path.join(pluginDir, pluginName));
    app.commandLine.appendSwitch('ppapi-flash-version', '25.0.0.127');
  }

  onReady() {
    this.application = new Application();
    this.application.launch();
  }

  onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }
}

const main = new Main();
main.loadFlashPlugin();

app.on('ready', () => main.onReady());
app.on('window-all-closed', () => main.onWindowAllClosed());
