import {BrowserWindow, ipcMain, session} from 'electron';

export default class LoginModal {
  constructor(parent) {
    const publicPath = process.env.NODE_ENV === 'development' ? `file://${__dirname}/../renderer/login` : `file://${__dirname}/login`;

    this.ipc = ipcMain;

    this.window = new BrowserWindow({
      parent: parent,
      modal: true,
      show: false,
      width: 600,
      height: 400,
      resizable: false
    });
    this.window.loadURL(`${publicPath}/index.html`);
    this.window.once('ready-to-show', () => this.window.show());
    this.window.on('closed', () => this.window = null);

    this.ipc.on('RequestSetCookie', ::this._onRequestSetCookie)
  }

  _onRequestSetCookie(e, cookieValue) {
    const cookie = {
      url: 'http://.nicovideo.jp',
      name: 'user_session',
      value: cookieValue
    }

    session.defaultSession.cookies.set(cookie, ((err) => {
      if (err) {
        alert(err);
      } else {
        this.window.close();
      }
    }));
  }
}
