import React from 'react';
import {ipcRenderer} from 'electron';
import fa from 'font-awesome/css/font-awesome.css';
import NicoliveAPI from 'nicolive-api';
import cheerio from 'cheerio';
import styles from './Viewer.css';
import AppLocator from '../../../AppLocator';
import SearchLiveUseCase from '../../../use-cases/SearchLiveUseCase';
import ControlPlayerUseCase from '../../../use-cases/ControlPlayerUseCase';

export default class LiveViewer extends React.Component {
  static propTypes = {
    item: React.PropTypes.object
  };

  constructor() {
    super();

    this.state = {
      isExpandedDescription: false,
      intervalId: null
    };
    this.client = null;
    this.windowId = Number(window.location.hash.replace('#', ''));
  }

  componentDidMount() {
    const cookie = ipcRenderer.sendSync('RequestGetCookie');
    if (!cookie) {
      ipcRenderer.send('RequestOpenLoginModal', this.windowId);
      return;
    }
    this.client = new NicoliveAPI(`user_session=${cookie}`);
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
        .then(() => this.setState({intervalId: setInterval(() => this.checkLiveStatus(nextProps.item.id), 3 * 60 * 1000)}))
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
      .then(() => {})
      .catch(err => {
        if (err === 'notlogin') {
          clearInterval(this.state.intervalId);
          ipcRenderer.send('RequestOpenLoginModal', this.windowId);
        } else {
          AppLocator.context.useCase(ControlPlayerUseCase.create()).execute('forward');
        }
      });
  }

  toggleExpandDescription(isExpandedDescription) {
    this.setState({isExpandedDescription});
  }

  handleSearchTag(tag) {
    AppLocator.context.useCase(SearchLiveUseCase.create()).execute({
      word: tag,
      type: 'tag'
    })
  }

  renderTags() {
    return this.props.item.tags.split(/\s/).map((tag, i) => {
      return (
        <p
          key={i}
          className={styles.tag}
          onClick={() => ::this.handleSearchTag(tag)}
        >
          {tag}
        </p>
      );
    });
  }

  renderHeader() {
    const {item} = this.props;
    const {isExpandedDescription} = this.state;

    if (!item) return null;
    return (
      <div className={styles.webviewHeader}>
        <div className={styles.tagsContainer}>
          <i className={`${fa.fa} ${fa['fa-tags']}`} />
          {this.renderTags()}
        </div>
        <span className={isExpandedDescription ? styles.expandedDescription : styles.description}>{cheerio.load(item.description).text()}</span>
        <div className={styles.expand}>
          {
            isExpandedDescription ? (
              <span onClick={() => ::this.toggleExpandDescription(false)}><i className={`${fa.fa} ${fa['fa-chevron-up']}`} /> 説明文を閉じる</span>
            ) : <span onClick={() => ::this.toggleExpandDescription(true)}><i className={`${fa.fa} ${fa['fa-chevron-down']}`} /> 説明文を開く</span>
          }
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.container}>
        {this.renderHeader()}
        <div
          id="webview"
          className={styles.webviewContainer}
          ref="webview"
        />
      </div>
    );
  }
}
