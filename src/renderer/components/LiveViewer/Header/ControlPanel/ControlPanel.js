import React from 'react';
import fa from 'font-awesome/css/font-awesome.css';
import AppLocator from '../../../../AppLocator';
import ControlPlayerUseCase from '../../../../use-cases/ControlPlayerUseCase';
import styles from './ControlPanel.css';

export default class ControlPanel extends React.Component {
  static propTypes = {
    isPlaying: React.PropTypes.bool.isRequired
  }

  handleControl(operation) {
    AppLocator.context.useCase(ControlPlayerUseCase.create()).execute(operation);
  }

  render() {
    return (
      <div className={styles.container}>
        <span className={styles.item}>
          <i
            className={`${fa.fa} ${fa['fa-backward']} ${fa['fa-lg']}`}
            title="前へ"
            onClick={() => ::this.handleControl('backward')}
          />
        </span>
        <span className={styles.item}>
          {
            this.props.isPlaying ? (
              <i
                className={`${fa.fa} ${fa['fa-stop-circle-o']} ${fa['fa-3x']}`}
                title="停止"
                onClick={() => ::this.handleControl('stop')}
              />
            ) : (
              <i
                className={`${fa.fa} ${fa['fa-play-circle-o']} ${fa['fa-3x']}`}
                title="再生"
                onClick={() => ::this.handleControl('play')}
              />
            )
          }
        </span>
        <span className={styles.item}>
          <i
            className={`${fa.fa} ${fa['fa-forward']} ${fa['fa-lg']}`}
            title="次へ"
            onClick={() => ::this.handleControl('forward')}
          />
        </span>
      </div>
    );
  }
}
