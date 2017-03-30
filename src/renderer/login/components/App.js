import React from 'react';
import nicolive from 'nicolive-api';
import {ipcRenderer} from 'electron';
import SessionExtractor from '../../libraries/SessionExtractor';
import styles from './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.ipc = ipcRenderer;
    this.state = {
      email: "",
      password: "",
      browser: ""
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
        password: ''
      });
    } else {
      this.setState({browser: ''});
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.browser) {
      const sessionExtractor = new SessionExtractor();
      sessionExtractor.extract()
        .then(sessionId => this.ipc.send('RequestSetCookie', sessionId))
        .catch(() => {
          this.setState({browser: ''});
          alert('ログイン情報の取得に失敗しました');
        });
    } else {
      nicolive.login({email: this.state.email, password: this.state.password})
        .then(client => this.ipc.send('RequestSetCookie', client.cookie.split('=')[1].replace(/;/, '')))
        .catch(() => alert('ログインに失敗しました'));
    }
  }

  render() {
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
            <p>またはブラウザのCookieを使用する</p>
            <div className={styles.formGroup}>
              <div className={styles.selectBox}>
                <select
                  id="browser"
                  className={styles.select}
                  value={browser}
                  onChange={::this.handleChangeBrowser}
                >
                  <option value=""></option>
                  <option value="chrome">Google Chrome</option>
                </select>
              </div>
            </div>
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
}
