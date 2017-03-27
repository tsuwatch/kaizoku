import React from 'react';
import nicolive from 'nicolive-api';
import {ipcRenderer} from 'electron';
import fa from 'font-awesome/css/font-awesome.css';
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
        browser: event.target.value,
        email: '',
        password: ''
      });
    } else {
      this.setState({browser: ''});
    }
  }

  handleSubmit() {
    if (this.state.browser) {
      const sessionExtractor = new SessionExtractor();
      sessionExtractor.extract()
        .then(sessionId => {
          this.ipc.send('RequestSetCookie', sessionId);
        })
        .catch(err => {
          alert('ログイン情報が存在しません');
        });
    } else {
      nicolive.login({email: this.state.email, password: this.state.password})
        .then(client => {
          console.log(client.cookie.split('=')[1]);
          this.ipc.send('RequestSetCookie', client.cookie.split('=')[1].replace(/;/, ''));
        })
        .catch(err => {
          alert('ログインに失敗しました');
        });
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
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label
                htmlFor="email"
                className={styles.formLabel}
              >
                メールアドレス
              </label>
              <div>
                <input
                  type="email"
                  id="email"
                  className={styles.input}
                  disabled={!!browser}
                  value={email}
                  onChange={::this.handleInputEmail}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label
                htmlFor="password"
                className={styles.formLabel}
              >
                パスワード
              </label>
              <div>
                <input
                  type="password"
                  id="password"
                  className={styles.input}
                  value={password}
                  disabled={!!browser}
                  onChange={::this.handleInputPassword}
                />
              </div>
            </div>
            <p>or</p>
            <div className={styles.formGroup}>
              <label
                htmlFor="browser"
                className={styles.formLabel}
              >
                ブラウザ
              </label>
              <div>
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
          </div>
        </div>
      </div>
    );
  }
}
