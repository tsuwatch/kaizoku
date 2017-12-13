import fs from 'fs';
import path from 'path';
import {app, ipcMain, session, dialog} from 'electron';
import GhReleases from 'electron-gh-releases';
import MainWindow from './MainWindow';
import ApplicationMenu from './ApplicationMenu';

export default class Application {
  constructor() {
    this.windows = new Map();
    this.ipc = ipcMain;

    this.ipc.on('RequestStore', ::this._onRequestStore);
    this.ipc.on('RequestRestore', ::this._onRequestRestore);
    this.ipc.on('RequestOpenLoginModal', ::this._onRequestOpenLoginModal);
    this.ipc.on('RequestGetCookie', ::this._onRequestGetCookie)
    this.ipc.on('RequestSetCookie', ::this._onRequestSetCookie)
  }

  launch() {
    this.mainWindow = new MainWindow();
    this.windows.set(this.mainWindow.window.id, this.mainWindow);
    new ApplicationMenu(this.mainWindow.window);
  }

  checkUpdate() {
    const updater = new GhReleases({
      repo: 'tsuwatch/kaizoku',
      currentVersion: app.getVersion()
    });

    updater.check((err, status) => {
      if (!err && status) updater.download();
    });

    updater.on('update-downloaded', (data) => {
      const id = dialog.showMessageBox({
        type: 'info',
        buttons: ['あとで', '再起動して更新する'],
        message: `新しいバージョンをダウンロードしました。今すぐ更新しますか？\n\n${data[2]}\n\n${data[1]}`,
        cancelId: 0
      });

      if (id === 0) return;
      updater.install();
    });
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

  _onRequestGetCookie(e) {
    session.defaultSession.cookies.get({ url: 'http://.nicovideo.jp' }, ((err, cookies) => {
      const cookie = cookies.find(cookie => cookie['name'] === 'user_session')
      e.returnValue = cookie ? cookie['value'] : null;
    }));
  }

  _onRequestOpenLoginModal(ev, id) {
    const w = this.windows.get(id);
    w.createLoginModal();
  }

  _onRequestSetCookie(e, cookieValue, windowId = null) {
    const cookie = {
      url: 'http://.nicovideo.jp',
      name: 'user_session',
      value: cookieValue
    }

    session.defaultSession.cookies.set(cookie, (err => {
      if (err) {
        e.sender.send('error', err);
        e.returnValue = err;
      } else {
        e.returnValue = true;
        if (windowId) this.windows.get(windowId).closeLoginModal();
      }
    }));
  }
}
