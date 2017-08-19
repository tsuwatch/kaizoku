import React from 'react';
import cheerio from 'cheerio';
import fa from 'font-awesome/css/font-awesome.css';
import styles from './Header.css';
import AppLocator from '../../../AppLocator';
import SearchLiveUseCase from '../../../use-cases/SearchLiveUseCase';
import ToggleFullscreenUseCase from '../../../use-cases/ToggleFullscreenUseCase';
import ToggleCommentViewerUseCase from '../../../use-cases/ToggleCommentViewerUseCase';

export default class Header extends React.Component {
  static propTypes = {
    screenMode: React.PropTypes.string.isRequired,
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

  toggleCommentViewer() {
    AppLocator.context.useCase(ToggleCommentViewerUseCase.create()).execute();
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
    const {item, screenMode} = this.props;
    const {isExpandedDescription} = this.state;

    return (
      <div
        style={{left: `${screenMode === 'fullscreen' ? 0 : '510px'}`}}
        className={styles.webviewHeader}
      >
        <div className={styles.iconsContainer}>
          <i
            className={`${fa.fa} ${fa['fa-comments-o']} ${styles.button} ${screenMode === 'commentViewer' ? styles.fill : null}`}
            onClick={::this.toggleCommentViewer}
          />
          <i
            className={`${fa.fa} ${fa['fa-window-maximize']} ${styles.button} ${screenMode === 'fullscreen' ? styles.fill : null}`}
            onClick={::this.toggleFullscreen}
            title={`${screenMode === 'fullscreen' ? '最小化' : '最大化'}`}
          />
          <div className={styles.countContainer}>
            <i className={`${fa.fa} ${fa['fa-user-o']} ${styles.icon}`} />
            <span>{item.viewCounter}</span>
          </div>
          <div className={styles.countContainer}>
            <i className={`${fa.fa} ${fa['fa-commenting-o']} ${styles.icon}`} />
            <span>{item.commentCounter}</span>
          </div>

        </div>
        <span className={styles.title}>{item.title}</span>
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
}
