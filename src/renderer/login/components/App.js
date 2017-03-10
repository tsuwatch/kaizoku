import React from 'react';
import {ipcRenderer} from 'electron';
import SessionExtractor from '../../libraries/SessionExtractor';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.ipc = ipcRenderer;
  }

  handleLogin() {
    const sessionExtractor = new SessionExtractor();
    sessionExtractor.extract()
      .then((sessionId) => {
        this.ipc.send('RequestSetCookie', sessionId);
      })
      .catch((err) => {
        alert('ログイン情報が存在しません');
      });
  }

  render() {
    return (
      <div>
        <p onClick={::this.handleLogin}>ログイン</p>
      </div>
    );
  }
}
