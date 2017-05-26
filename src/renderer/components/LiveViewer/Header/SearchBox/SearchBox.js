import React from 'react';
import StarIcon from './StarIcon/StarIcon';
import AppLocator from '../../../../AppLocator';
import SearchLiveUseCase from '../../../../use-cases/SearchLiveUseCase';
import styles from './SearchBox.css';

export default class SearchBox extends React.Component {
  static propTypes = {
    searchBox: React.PropTypes.object.isRequired,
    favorite: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      word: props.searchBox.word,
      type: props.searchBox.type,
      sort: props.searchBox.sort
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      word: nextProps.searchBox.word,
      type: nextProps.searchBox.type,
      sort: nextProps.searchBox.sort
    });
  }

  handleInput(e) {
    this.setState({word: e.target.value});
  }

  handleChangeType(e) {
    this.setState({type: e.target.value});
    AppLocator.context.useCase(SearchLiveUseCase.create()).execute({
      word: this.state.word,
      type: e.target.value,
      sort: this.state.sort
    });
  }

  handleChangeSort(e) {
    this.setState({sort: e.target.value});
    AppLocator.context.useCase(SearchLiveUseCase.create()).execute({
      word: this.state.word,
      type: this.state.type,
      sort: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    AppLocator.context.useCase(SearchLiveUseCase.create()).execute({
      word: this.state.word,
      type: this.state.type,
      sort: this.state.sort
    });
  }

  isStared() {
    return !!this.props.favorite.items.find(item => item.word === this.props.searchBox.word && item.type === this.props.searchBox.type);
  }

  render() {
    const {searchBox} = this.props;

    return (
      <form
        className={styles.container}
        onSubmit={::this.handleSubmit}
      >
        <select
          className={styles.selectType}
          value={this.state.type}
          onChange={::this.handleChangeType}
        >
          <option value="word">キーワード</option>
          <option value="tag">タグ</option>
        </select>
        <select
          className={styles.selectSort}
          value={this.state.sort}
          onChange={::this.handleChangeSort}
        >
          <option value="-startTime">放送日時が近い順</option>
          <option value="+startTime">放送日時が遠い順</option>
          <option value="-scoreTimeshiftReserved">タイムシフト予約数が多い順</option>
          <option value="+scoreTimeshiftReserved">タイムシフト予約数が少ない順</option>
          <option value="-viewCounter">来場者数が多い順</option>
          <option value="+viewCounter">来場者数が少ない順</option>
          <option value="-commentCounter">コメント数が多い順</option>
          <option value="+commentCounter">コメント数が少ない順</option>
        </select>
        <input
          type="search"
          className={styles.search}
          placeholder='検索'
          onChange={::this.handleInput}
          value={this.state.word}
        />
        {searchBox.mode === 'search' && searchBox.word ? (<StarIcon isStared={this.isStared()} />) : null}
      </form>
    );
  }
}
