import React from 'react';
import cheerio from 'cheerio';
import fa from 'font-awesome/css/font-awesome.css';
import styles from './Header.css';
import AppLocator from '../../../../AppLocator';
import SearchLiveUseCase from '../../../../use-cases/SearchLiveUseCase';
import ToggleFullscreenUseCase from '../../../../use-cases/ToggleFullscreenUseCase';

export default class Header extends React.Component {
  static propTypes = {
    isFullscreen: React.PropTypes.bool.isRequired,
    item: React.PropTypes.object.isRequired
  };

  constructor() {
    super();

    this.state = {
      isExpandedDescription: false
    };
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

  toggleFullscreen() {
    AppLocator.context.useCase(ToggleFullscreenUseCase.create()).execute();
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

  render() {
    const {item, isFullscreen} = this.props;
    const {isExpandedDescription} = this.state;

    return (
      <div
        style={{left: `${isFullscreen ? 0 : '540px'}`}}
        className={styles.webviewHeader}
      >
        <div className={styles.tagsContainer}>
          <i
            className={`${fa.fa} ${fa['fa-window-maximize']} ${styles.button} ${isFullscreen ? styles.fill : null}`}
            onClick={::this.toggleFullscreen}
          />
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
}
