import React from 'react';
import AppLocator from '../../../AppLocator';
import SearchLiveUseCase from '../../../use-cases/SearchLiveUseCase';
import ViewMyPageUseCase from '../../../use-cases/ViewMyPageUseCase';
import styles from './Sidebar.css';

export default class Sidebar extends React.Component {
  static propTypes = {
    searchBox: React.PropTypes.object.isRequired,
    favorite: React.PropTypes.object.isRequired
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
    AppLocator.context.useCase(ViewMyPageUseCase.create()).execute();
  }

  handleSearch(selectedItem) {
    AppLocator.context.useCase(SearchLiveUseCase.create()).execute({
      word: selectedItem.word,
      type: selectedItem.type,
      sort: selectedItem.sort
    });
  }

  render() {
    const {searchBox} = this.props;

    return (
      <div className={styles.container}>
        <div
          className={searchBox.mode === 'my' ? styles.selectedMenu : styles.menu}
          onClick={::this.handleViewMyPage}
        >
          {searchBox.mode === 'my' ? (<span className={styles.menuBorder} />) : null}
          <span>マイページ</span>
        </div>
        <div className={styles.menuHeader}>キーワード</div>
        <ul className={styles.list}>
          {this.renderItems('word')}
        </ul>
        <div className={styles.menuHeader}>タグ</div>
        <ul className={styles.list}>
          {this.renderItems('tag')}
        </ul>
      </div>
    );
  }
}
