import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import AppLocator from '../AppLocator';

ReactDOM.render(<App appContext={AppLocator.context} />, document.getElementById('root'));
