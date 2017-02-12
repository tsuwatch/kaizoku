import React from 'react';
import fa from 'font-awesome/css/font-awesome.css';
import AppLocator from '../../../../AppLocator';
import FavoriteSearchConditionUseCase from '../../../../use-cases/FavoriteSearchConditionUseCase';
import styles from './StarIcon.css';

export default class StarIcon extends React.Component {
  static propTypes = {
    isStared: React.PropTypes.bool.isRequired
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

  handleFavorite() {
    AppLocator.context.useCase(FavoriteSearchConditionUseCase.create()).execute(!this.props.isStared);
  }

  render() {
    return (
      <div className={styles.container}>
        {
          this.state.isMouseOver || this.props.isStared ? (
            <i
              className={`${fa.fa} ${fa['fa-star']} ${fa['fa-lg']} ${styles.filled} ${styles.star}`}
              onMouseLeave={() => ::this.handleMouseOver(false)}
              onClick={::this.handleFavorite}
            />
          ) : (
            <i
              className={`${fa.fa} ${fa['fa-star-o']} ${fa['fa-lg']} ${styles.star}`}
              onMouseEnter={() => ::this.handleMouseOver(true)}
            />
          )
        }
      </div>
    );
  }
}
