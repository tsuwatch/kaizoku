import React from 'react';
import {ipcRenderer} from 'electron';
import AppLocator from '../../../AppLocator';
import SearchLiveUseCase from '../../../use-cases/SearchLiveUseCase';
import ViewMyPageUseCase from '../../../use-cases/ViewMyPageUseCase';
import ViewRankingUseCase from '../../../use-cases/ViewRankingUseCase';
import styles from './Sidebar.css';

export default class Sidebar extends React.Component {
  static propTypes = {
    isFullscreen: React.PropTypes.bool.isRequired,
    searchBox: React.PropTypes.object.isRequired,
    favorite: React.PropTypes.object.isRequired
  }

  constructor() {
    super();

    this.windowId = Number(window.location.hash.replace('#', ''));
  }

  isSelectedItem(item) {
    const {searchBox} = this.props;
    return !!(searchBox.mode === 'search' && searchBox.word === item.word && searchBox.type === item.type);
  }

  renderItems(type) {
    if (!this.props.favorite.items) return null;
    return this.props.favorite.items.filter(item => item.type === type).map((condition, i) => {
      return (
        <li
          key={i}
          className={this.isSelectedItem(condition) ? styles.selectedItem :  styles.item}
          onClick={() => ::this.handleSearch(condition)}
        >
          {this.isSelectedItem(condition) ? (<span className={styles.itemBorder} />) : null}
          <span>{`${condition.word}`}</span>
        </li>
      )
    })
  }

  handleViewMyPage() {
    AppLocator.context.useCase(ViewMyPageUseCase.create()).execute().catch(err => {
      if (err === 'notlogin') ipcRenderer.send('RequestOpenLoginModal', this.windowId);
    });
  }

  handleViewRanking(mode) {
    AppLocator.context.useCase(ViewRankingUseCase.create()).execute(mode).catch(err => {
      if (err === 'notlogin') ipcRenderer.send('RequestOpenLoginModal', this.windowId);
    });
  }

  handleSearch(selectedItem) {
    AppLocator.context.useCase(SearchLiveUseCase.create()).execute({
      word: selectedItem.word,
      type: selectedItem.type,
      sort: selectedItem.sort
    });
  }

  render() {
    const {searchBox, favorite} = this.props;

    return (
      <div
        style={{display: `${this.props.isFullscreen ? 'none' : ''}`}}
        className={styles.container}
      >
        <div
          className={searchBox.mode === 'my' ? styles.selectedMenu : styles.menu}
          onClick={::this.handleViewMyPage}
        >
          {searchBox.mode === 'my' ? (<span className={styles.menuBorder} />) : null}
          <span>マイページ</span>
        </div>
        <div className={styles.menuHeader}>ランキング</div>
        <ul className={styles.list}>
          <li
            className={searchBox.mode === 'user_ranking' ? styles.selectedItem :  styles.item}
            onClick={() => ::this.handleViewRanking('user')}
          >
            {searchBox.mode === 'user_ranking' ? (<span className={styles.itemBorder} />) : null}
            <span>ユーザー</span>
          </li>
          <li
            className={searchBox.mode === 'official_ranking' ? styles.selectedItem :  styles.item}
            onClick={() => ::this.handleViewRanking('official')}
          >
            {searchBox.mode === 'official_ranking' ? (<span className={styles.itemBorder} />) : null}
            <span>公式＆ＣＨ</span>
          </li>
        </ul>
        {favorite.items.filter(item => item.type === 'word').length > 0 ? (<div className={styles.menuHeader}>キーワード</div>) : null}
        <ul className={styles.list}>
          {this.renderItems('word')}
        </ul>
        {favorite.items.filter(item => item.type === 'tag').length > 0 ? (<div className={styles.menuHeader}>タグ</div>) : null}
        <ul className={styles.list}>
          {this.renderItems('tag')}
        </ul>
      </div>
    );
  }
}
