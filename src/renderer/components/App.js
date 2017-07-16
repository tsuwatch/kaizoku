import React from 'react';
import nicolive from 'nicolive-api';
import {ipcRenderer} from 'electron';
import Main from './Main';
import AppLocator from '../AppLocator';
import SessionExtractor from '../libraries/SessionExtractor';
import AlertJumpUseCase from '../use-cases/AlertJumpUseCase.js';
import styles from './App.css';

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      alert: false,
      loggedIn: false,
      email: '',
      password: '',
      browser: ''
    };
  }

  handleInputEmail(event) {
    this.setState({email: event.target.value});
  }

  handleInputPassword(event) {
    this.setState({password: event.target.value});
  }

  handleChangeBrowser(event) {
    const browser = event.target.value;
    if (browser) {
      this.setState({
        browser,
        email: '',
        password: '',
        alert: false
      });
    } else {
      this.setState({browser: ''});
    }
  }

  handleChangeAlert(event) {
    this.setState({alert: event.target.checked});
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.state.browser) {
      const sessionExtractor = new SessionExtractor();

      sessionExtractor.extract()
        .then(sessionId => {
          const loggedIn = ipcRenderer.sendSync('RequestSetCookie', sessionId);
          if (loggedIn === true) this.setState({loggedIn});
        })
        .catch(() => {
          this.setState({browser: ''});
          alert('ログイン情報の取得に失敗しました');
        });
    } else {
      nicolive.login({email: this.state.email, password: this.state.password})
        .then(client => {
          const loggedIn = ipcRenderer.sendSync('RequestSetCookie', client.cookie.split('=')[1].replace(/;/, ''));
          if (loggedIn === true) {
            if (this.state.alert) this.connectAlert(client);
            this.setState({loggedIn});
          }
         })
        .catch(() => alert('ログインに失敗しました'));
    }
  }

  connectAlert(client) {
    client.connectAlert().then(viewer => {
      viewer.connection.on('error', () => alert('ニコ生アラートが停止しました'));
      viewer.connection.on('notify', (info => {
        const notification = new Notification(
          `${info.title} - ${info.name}`,
          {
            body: info.description,
            icon: info.thumbnail
          }
        );
        notification.onclick = () => AppLocator.context.useCase(AlertJumpUseCase.create()).execute(info);
      }));
    });
  }

  renderAlertCheckbox() {
    const {browser} = this.state;
    const canAlert = !browser;

    return (
      <div>
        <label className={canAlert ? '' : styles.disabledCheckbox}>
          <input
            className={canAlert ? '' : styles.disabledCheckbox}
            type="checkbox"
            onChange={::this.handleChangeAlert}
            disabled={!canAlert}
            checked={this.state.alert}
          /> 番組の開始を通知する
        </label>
      </div>
    );
  }

  renderCookieLogin() {
    if (process.platform !== 'darwin') return null;

    return (
      <div>
        <p>またはブラウザのCookieを使用する</p>
        <div className={styles.formGroup}>
          <div className={styles.selectBox}>
            <select
              id="browser"
              className={styles.select}
              value={this.state.browser}
              onChange={::this.handleChangeBrowser}
            >
              <option value=""></option>
              <option value="chrome">Google Chrome</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  renderLogin() {
    const {
      browser,
      email,
      password
    } = this.state;

    return (
      <div className={styles.window}>
        <div className={styles.container}>
          <form
            className={styles.form}
            onSubmit={::this.handleSubmit}
          >
            <div className={styles.formGroup}>
              <input
                type="email"
                id="email"
                className={styles.input}
                disabled={!!browser}
                value={email}
                placeholder={"メールアドレス"}
                onChange={::this.handleInputEmail}
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="password"
                id="password"
                className={styles.input}
                value={password}
                placeholder={"パスワード"}
                disabled={!!browser}
                onChange={::this.handleInputPassword}
              />
            </div>
            {this.renderCookieLogin()}
            {this.renderAlertCheckbox()}
            <div className={styles.formGroup}>
              <button
                type="submit"
                className={styles.button}
                onClick={::this.handleSubmit}
              >
                ログイン
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  render() {
    const {loggedIn} = this.state;

    if (loggedIn) {
      return (<Main />)
    } else {
      return this.renderLogin()
    }
  }
}
