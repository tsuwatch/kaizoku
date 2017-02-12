import React from 'react';
import fa from 'font-awesome/css/font-awesome.css';
import AppLocator from '../../../AppLocator';
import RefreshPlaylistUseCase from '../../../use-cases/RefreshPlaylistUseCase';
import styles from './RefreshButton.css';

export default class RefreshButton extends React.Component {
  static propTypes = {
    isRequesting: React.PropTypes.bool.isRequired,
  }

  handleRefresh() {
    if (this.props.isRequesting) return;

    AppLocator.context.useCase(RefreshPlaylistUseCase.create()).execute();
  }

  render() {
    return (
      <i
        className={`${fa.fa} ${fa['fa-refresh']} ${fa['fa-lg']} ${styles.container} ${this.props.isRequesting? `${fa['fa-spin']}` : ''}`}
        title="更新"
        onClick={::this.handleRefresh}
      />
    );
  }
}
