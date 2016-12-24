import {app} from 'electron';
import MainWindow from './browser/MainWindow';

class Main {
  constructor() {
    this.mainWindow = null;
  }

  onReady() {
    this.mainWindow = new MainWindow();
    this.mainWindow.createLoginModal();
  }

  onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }
}

const main = new Main();

app.on('ready', () => {
  main.onReady();
});

app.on('window-all-closed', () => {
  main.onWindowAllClosed();
});
