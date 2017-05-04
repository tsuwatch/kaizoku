import React from 'react';
import ReactDOM from 'react-dom';
import {Context, Dispatcher} from 'almin';
import App from './components/App';
import AppLocator from './AppLocator';
import AppStoreGroup from './stores/AppStoreGroup';
import InitializeDomainUseCase from './use-cases/InitializeDomainUseCase';

class Application {
  run() {
    this.initialize().then(() => this.render());
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

  render() {
    ReactDOM.render(<App />, document.getElementById('root'));
  }
}

new Application().run();
