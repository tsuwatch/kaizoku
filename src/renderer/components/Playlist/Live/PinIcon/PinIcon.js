import React from 'react';
import fa from 'font-awesome/css/font-awesome.css';
import AppLocator from '../../../../AppLocator';
import PinLiveUseCase from '../../../../use-cases/PinLiveUseCase.js';
import styles from './PinIcon.css';

export default class PinIcon extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    pinned: React.PropTypes.bool.isRequired
  };

  constructor() {
    super();

    this.state = {
      isMouseOver: false
    };
  }

  handleMouseOver(isMouseOver) {
    this.setState({isMouseOver});
  }

  handlePin() {
    AppLocator.context.useCase(PinLiveUseCase.create()).execute(this.props.id);
  }

  render() {
    return (
      <div className={styles.container}>
        {
          this.state.isMouseOver || this.props.pinned ? (
            <i
              className={`${fa.fa} ${fa['fa-check-circle']} ${fa['fa-lg']} ${styles.filled}`}
              onMouseLeave={() => ::this.handleMouseOver(false)}
              onClick={::this.handlePin}
            />
          ) : (
            <i
              className={`${fa.fa} ${fa['fa-check-circle-o']} ${fa['fa-lg']}`}
              onMouseEnter={() => ::this.handleMouseOver(true)}
            />
          )
        }
      </div>
    );
  }
}
