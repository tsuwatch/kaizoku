import React from 'react';
import ReactDOM from 'react-dom';
import {Context, Dispatcher} from 'almin';
import App from './components/App';
import AppLocator from './AppLocator';
import AppStoreGroup from './stores/AppStoreGroup';
import InitializeDomainUseCase from './use-cases/InitializeDomainUseCase';

AppLocator.context = new Context({
  dispatcher: new Dispatcher(),
  store: AppStoreGroup.create()
});

AppLocator.context.useCase(InitializeDomainUseCase.create()).execute().then(() => {
  ReactDOM.render(<App appContext={AppLocator.context} />, document.getElementById('root'));
});
