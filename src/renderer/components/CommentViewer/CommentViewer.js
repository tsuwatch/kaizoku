import React from 'react';
import {ipcRenderer} from 'electron';
import NicoliveAPI from 'nicolive-api';
import AppLocator from '../../AppLocator';
import AddCommentUseCase from '../../use-cases/AddCommentUseCase';
import CommentList from './CommentList/CommentList';
import styles from './CommentViewer.css';

export default class CommentViewer extends React.Component {
  static propTypes = {
    screenMode: React.PropTypes.string.isRequired,
    item: React.PropTypes.object
  };

  constructor() {
    super();

    this.client = null;
    this.manager = null;
    this.shouldScroll = true;
  }
    
  componentDidMount() {
    this.scrollToBottom();
  }

  componentWillUpdate() {
    const {container} = this.refs;
    this.shouldScroll = container.scrollTop + container.offsetHeight === container.scrollHeight;
  }

  componentDidUpdate() {
    if (this.shouldScroll) this.scrollToBottom();
  }

  componentWillReceiveProps(nextProps) {
    this.client = new NicoliveAPI(`user_session=${ipcRenderer.sendSync('RequestGetCookie')}`);

    // 放送を閉じた場合
    if (!nextProps.item) this.disconnectCommentServer();
    if (nextProps.item) {
      // 違う放送を開いた場合
      if (this.props.item && nextProps.item.id !== this.props.item.id) this.disconnectCommentServer();
      if (nextProps.screenMode === 'commentViewer') {
        if (nextProps.item.id === this.props.item.id && this.manager) return;
        this.client.connectLive(nextProps.item.id)
          .then(manager => {
            this.manager = manager;
            this.manager.viewer.connection.on('comment', (comment => AppLocator.context.useCase(AddCommentUseCase.create()).execute(nextProps.item.id, this.manager.messageServer, comment)));
          })
          .catch(() => alert('コメントサーバーへの接続に失敗しました'));
      }
    }
  }

  scrollToBottom() {
    this.refs.bottom.scrollIntoView({behavior: 'smooth'});
  }

  disconnectCommentServer() {
    if (this.manager) {
      this.manager.disconnect();
      this.manager = null;
    }
  }

  render() {
    const {item} = this.props;

    return (
      <div
        style={{display: `${this.props.screenMode !== 'commentViewer' ? 'none' : ''}`}}
        className={styles.container}
        ref="container"
      >
        <div className={styles.listWrapper}>
          <CommentList comments={item ? item.comments : []} />
          <div ref="bottom" />
        </div>
      </div>
    );
  }
}
