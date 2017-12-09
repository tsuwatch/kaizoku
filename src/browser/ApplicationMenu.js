import {app, Menu, shell} from 'electron';

export default class ApplicationMenu {
  constructor(mainWindow) {
    const template = [
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo'},
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'pasteandmatchstyle' },
          { role: 'delete' },
          { role: 'selectall' },
          { type: 'separator' },
          { label: '検索', accelerator: 'CmdOrCtrl+F', click() { mainWindow.webContents.send('search') } }
        ]
      },
      {
        label: 'View',
        submenu: [
          process.env.NODE_ENV === 'development' ? {
            role: 'reload'
          } : {
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click() { mainWindow.webContents.send('reload') }
          },
          process.env.NODE_ENV === 'development' ? { role: 'toggledevtools' } : { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        role: 'window',
        submenu: [
          { role: 'minimize' },
          { role: 'close' }
        ]
      },
      {
        role: 'help',
        submenu: [
          { label: 'Learn More', click() { shell.openExternal('https://github.com/tsuwatch/nicomentron') } }
        ]
      }
    ]

    if (process.platform === 'darwin') {
      template.unshift({
        label: app.getName(),
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      });
      template[3].submenu = [
        { label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close' },
        { label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
        { label: 'Zoom', role: 'zoom' },
      ]
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
}
