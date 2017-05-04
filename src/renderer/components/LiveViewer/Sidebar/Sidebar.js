import React from 'react';
import AppLocator from '../../../AppLocator';
import SearchLiveUseCase from '../../../use-cases/SearchLiveUseCase';
import styles from './Sidebar.css';

export default class Sidebar extends React.Component {
  static propTypes = {
    searchBox: React.PropTypes.object.isRequired,
    favorite: React.PropTypes.object.isRequired
  }

  isSelectedItem(item) {
    const {searchBox} = this.props;
    return !!(searchBox.word === item.word && searchBox.type === item.type);
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
          {this.isSelectedItem(condition) ? (<span className={styles.border} />) : null}
          <span>{`${condition.word}`}</span>
        </li>
      )
    })
  }

  handleSearch(selectedItem) {
    AppLocator.context.useCase(SearchLiveUseCase.create()).execute({
      word: selectedItem.word,
      type: selectedItem.type,
      sort: selectedItem.sort
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <span>キーワード</span>
        <ul className={styles.list}>
          {this.renderItems('word')}
        </ul>
        <span>タグ</span>
        <ul className={styles.list}>
          {this.renderItems('tag')}
        </ul>
      </div>
    );
  }
}
