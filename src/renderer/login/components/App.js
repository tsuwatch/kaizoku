import React from 'react';
import AppLocator from '../../AppLocator';
import EmailLoginUseCase from '../../use-cases/EmailLoginUseCase';
import CookieLoginUseCase from '../../use-cases/CookieLoginUseCase';
import styles from './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);

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
      AppLocator.context.useCase(CookieLoginUseCase.create()).execute()
        .catch(() => {
          this.setState({browser: ''});
          alert('ログイン情報の取得に失敗しました');
        });
    } else {
      AppLocator.context.useCase(EmailLoginUseCase.create()).execute({email: this.state.email, password: this.state.password})
        .catch(() => alert('ログインに失敗しました'));
    }
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
            {this.renderCookieLogin()}
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
