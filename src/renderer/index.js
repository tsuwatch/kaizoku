import React from 'react';
import ReactDOM from 'react-dom';
import {ipcRenderer} from 'electron';
import {Context, Dispatcher} from 'almin';
import App from './components/App';
import AppLocator from './AppLocator';
import AppStoreGroup from './stores/AppStoreGroup';
import InitializeDomainUseCase from './use-cases/InitializeDomainUseCase';
import RefreshPlaylistUseCase from './use-cases/RefreshPlaylistUseCase';

class Application {
  run() {
    this.initialize().then(() => {
      this.render();
      this.subscribeIpcEvents();
    });
  }

  initialize() {
    AppLocator.context = new Context({
      dispatcher: new Dispatcher(),
      store: AppStoreGroup.create()
    });

    return new Promise((resolve) => {
      Promise.all([
        AppLocator.context.useCase(InitializeDomainUseCase.create()).execute()
      ]).then(() => resolve());
    });
  }

  subscribeIpcEvents() {
    ipcRenderer.on('reload', () => AppLocator.context.useCase(RefreshPlaylistUseCase.create()).execute());
    ipcRenderer.on('search', () => document.getElementsByTagName('input')[0].focus());
  }

  render() {
    ReactDOM.render(<App />, document.getElementById('root'));
  }
}

new Application().run();
