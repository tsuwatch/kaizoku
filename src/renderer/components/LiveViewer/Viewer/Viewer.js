import React from 'react';
import {ipcRenderer} from 'electron';
import NicoliveAPI from 'nicolive-api';
import Header from './Header/Header';
import styles from './Viewer.css';
import AppLocator from '../../../AppLocator';
import ControlPlayerUseCase from '../../../use-cases/ControlPlayerUseCase';
import UpdateLiveUseCase from '../../../use-cases/UpdateLiveUseCase';

export default class LiveViewer extends React.Component {
  static propTypes = {
    item: React.PropTypes.object
  };

  constructor() {
    super();

    this.state = {
      intervalId: null
    };
    this.client = new NicoliveAPI(`user_session=${ipcRenderer.sendSync('RequestGetCookie')}`);
    this.windowId = Number(window.location.hash.replace('#', ''));
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.item && nextProps.item && this.props.item.id == nextProps.item.id) return;
    clearInterval(this.state.intervalId);

    const {webview} = this.refs;
    webview.innerHTML = '<webview style="width: 100%; height: 100%;" />'
    const wv = webview.querySelector('webview');
    wv.src = nextProps.item ? nextProps.item.url : '';
    wv.plugins = true;
    wv.addEventListener('did-start-loading', () => {
      if (process.env.NODE_ENV === 'development') wv.openDevTools();
    });
    wv.addEventListener('did-finish-load', () => {
      this.client.getPlayerStatus(nextProps.item.id)
        .then(status => {
          this.setState({intervalId: setInterval(() => this.checkLiveStatus(nextProps.item.id), 3 * 60 * 1000)})
          AppLocator.context.useCase(UpdateLiveUseCase.create()).execute(nextProps.item.id, status)
        })
        .catch(err => {
          if (err === 'notlogin') {
            ipcRenderer.send('RequestOpenLoginModal', this.windowId);
          } else {
            AppLocator.context.useCase(ControlPlayerUseCase.create()).execute('forward');
          }
        });
    });
  }

  checkLiveStatus(id) {
    this.client.getPlayerStatus(id)
      .then(status => AppLocator.context.useCase(UpdateLiveUseCase.create()).execute(id, status))
      .catch(err => {
        if (err === 'notlogin') {
          clearInterval(this.state.intervalId);
          ipcRenderer.send('RequestOpenLoginModal', this.windowId);
        } else {
          AppLocator.context.useCase(ControlPlayerUseCase.create()).execute('forward');
        }
      });
  }

  render() {
    return (
      <div className={styles.container}>
        {this.props.item ? (<Header item={this.props.item} />) : null}
        <div
          id="webview"
          className={styles.webviewContainer}
          ref="webview"
        />
      </div>
    );
  }
}
