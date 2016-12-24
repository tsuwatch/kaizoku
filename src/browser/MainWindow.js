import {app, BrowserWindow, ipcMain} from 'electron';
import path from 'path';
import windowStateKeeper from 'electron-window-state';
import LoginModal from './LoginModal';

export default class MainWindow {
  constructor() {
    const publicPath = process.env.NODE_ENV === 'development' ? `file://${__dirname}/../renderer` : `file://${__dirname}`;
    const windowState = windowStateKeeper();

    this.window = new BrowserWindow({ ...windowState });

    this.window.loadURL(`${publicPath}/index.html`);
    this.window.on('closed', () => this.window = null);
    windowState.manage(this.window);
    this.loginModal = null;
  }

  createLoginModal() {
    this.loginModal = new LoginModal(this.window);
  }
}
