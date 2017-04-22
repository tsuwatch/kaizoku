import {BrowserWindow} from 'electron';

export default class LoginModal {
  constructor(parent) {
    const publicPath = process.env.NODE_ENV === 'development' ? `file://${__dirname}/../renderer/login` : `file://${__dirname}/login`;

    this.window = new BrowserWindow({
      parent: parent,
      modal: true,
      show: false,
      width: 600,
      height: 400,
      resizable: false
    });
    this.window.loadURL(`${publicPath}/index.html#${parent.id}`);
    this.window.once('ready-to-show', () => this.window.show());
    this.window.on('closed', () => this.window = null);
  }
}
