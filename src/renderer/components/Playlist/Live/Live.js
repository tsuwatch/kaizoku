import React from 'react';
import cheerio from 'cheerio';
import fa from 'font-awesome/css/font-awesome.css';
import PinIcon from './PinIcon/PinIcon';
import styles from './Live.css';
import AppLocator from '../../../AppLocator';
import ControlPlayerUseCase from '../../../use-cases/ControlPlayerUseCase.js';

export default class Live extends React.Component {
  static propTypes = {
    item: React.PropTypes.object.isRequired,
    selected: React.PropTypes.bool.isRequired
  };

  constructor() {
    super();

    this.state = {
      onMouseOver: false
    };
  }

  handleClick() {
    AppLocator.context.useCase(ControlPlayerUseCase.create()).execute('play', this.props.item.id);
  }

  handleStop(e) {
    e.stopPropagation();
    AppLocator.context.useCase(ControlPlayerUseCase.create()).execute('stop');
  }

  toggleMouseOver(onMouseOver) {
    this.setState({onMouseOver});
  }

  renderElapsedTime() {
    const {item} = this.props;
    const diff = item.startTime ? new Date(Date.now() - item.startTime) : null;

    if (diff) return diff.getUTCHours() === 0 ? `${diff.getUTCMinutes()}分` : `${diff.getUTCHours()}時間${diff.getUTCMinutes()}分`
    return ' - 分';
  }

  renderPinIcon() {
    const {item} = this.props;

    return (
      this.state.onMouseOver || item.pinned ? (
        <PinIcon
          id={item.id}
          pinned={item.pinned}
        />
      ) : null
    );
  }

  render() {
    const {item, selected} = this.props;

    return (
      <div
        className={styles.container}
        onMouseEnter={() => ::this.toggleMouseOver(true)}
        onMouseLeave={() => ::this.toggleMouseOver(false)}
      >
        {this.renderPinIcon()}
        <div
          className={selected ? styles.selectedContent : styles.content}
          onClick={::this.handleClick}
        >
          <div className={styles.communityIconWrapper}>
            <img
              src={item.communityIcon}
              className={styles.communityIcon}
            />
          </div>
          <div className={styles.info}>
            <div className={styles.header}>
              <p className={selected ? styles.selectedTitle : styles.title}>{item.title}</p>
              <span className={styles.elapsedTime}>{this.renderElapsedTime()}</span>
            </div>
            <span className={styles.description}>{cheerio.load(item.description).text().trim()}</span>
            <div className={styles.countContainer}>
              <div className={styles.countItem}>
                <i className={`${fa.fa} ${fa['fa-user-o']} ${styles.icon}`} />
                <span>{item.viewCounter}</span>
              </div>
              <div className={styles.countItem}>
                <i className={`${fa.fa} ${fa['fa-commenting-o']} ${styles.icon}`} />
                <span>{item.commentCounter}</span>
              </div>
              <div className={styles.countItem}>
                <i className={`${fa.fa} ${fa['fa-clock-o']} ${styles.icon}`} />
                <span>{item.scoreTimeshiftReserved}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
