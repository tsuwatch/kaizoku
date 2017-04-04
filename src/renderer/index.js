import React from 'react';
import ReactDOM from 'react-dom';
import {ipcRenderer} from 'electron';
import App from './components/App';
import AppLocator from './AppLocator';
import InitializeDomainUseCase from './use-cases/InitializeDomainUseCase';
import RefreshPlaylistUseCase from './use-cases/RefreshPlaylistUseCase';

class Application {
  run() {
    this.render();
    this.subscribeIpcEvents();
  }

  subscribeIpcEvents() {
    ipcRenderer.on('reload', () => AppLocator.context.useCase(RefreshPlaylistUseCase.create()).execute());
    ipcRenderer.on('search', () => document.getElementsByTagName('input')[0].focus());
  }

  render() {
    AppLocator.context.useCase(InitializeDomainUseCase.create()).execute().then(() => {
      ReactDOM.render(<App appContext={AppLocator.context} />, document.getElementById('root'));
    });
  }
}

new Application().run();
