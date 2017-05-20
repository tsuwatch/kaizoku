import {BrowserWindow} from 'electron';
import windowStateKeeper from 'electron-window-state';
import LoginModal from './LoginModal';

export default class MainWindow {
  constructor() {
    const publicPath = process.env.NODE_ENV === 'development' ? `file://${__dirname}/../renderer` : `file://${__dirname}`;
    const windowState = windowStateKeeper();

    this.window = new BrowserWindow({
      titleBarStyle: 'hidden',
      backgroundColor: '#252525',
      minWidth: 600,
      minHeight: 400,
      webPreferences: {
        plugins: true
      },
      ...windowState
    });
    this.loginModal = null;

    this.window.loadURL(`${publicPath}/index.html#${this.window.id}`);
    this.window.on('closed', () => this.window = null);

    windowState.manage(this.window);
  }

  createLoginModal() {
    this.loginModal = new LoginModal(this.window);
  }

  closeLoginModal() {
    this.loginModal.window.close();
  }
}
