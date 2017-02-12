import {app, BrowserWindow, ipcMain} from 'electron';
import windowStateKeeper from 'electron-window-state';
import path from 'path';
import fs from 'fs';
import LoginModal from './LoginModal';

export default class MainWindow {
  constructor() {
    const publicPath = process.env.NODE_ENV === 'development' ? `file://${__dirname}/../renderer` : `file://${__dirname}`;
    const windowState = windowStateKeeper();

    this.ipc = ipcMain;

    this.window = new BrowserWindow({
      minWidth: 600,
      minHeight: 400,
      webPreferences: {
        plugins: true
      },
      ...windowState
    });

    this.window.loadURL(`${publicPath}/index.html`);
    this.window.on('closed', () => this.window = null);

    this.ipc.on('store', ::this._onRequestStore);
    this.ipc.on('restore', ::this._onRequestRestore);
    windowState.manage(this.window);
    this.loginModal = null;
  }

  createLoginModal() {
    this.loginModal = new LoginModal(this.window);
  }

  _onRequestStore(e, arg) {
    const data = JSON.stringify(arg.data);
    fs.writeFile(path.join(app.getPath('userData'), `${arg.name}.json`), data);
  }

  _onRequestRestore(e, name) {
    const fileName = path.join(app.getPath('userData'), `${name}.json`);
    fs.readFile(fileName, ((err, data) => {
      if (!err) {
        e.returnValue = JSON.parse(data);
      } else {
        e.returnValue = null;
      }
    }));
  }
}
