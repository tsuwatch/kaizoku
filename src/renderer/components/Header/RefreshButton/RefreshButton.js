import React from 'react';
import fa from 'font-awesome/css/font-awesome.css';
import AppLocator from '../../../AppLocator';
import RefreshPlaylistUseCase from '../../../use-cases/RefreshPlaylistUseCase';
import styles from './RefreshButton.css';

export default class RefreshButton extends React.Component {
  static propTypes = {
    searchBox: React.PropTypes.object.isRequired,
  }

  handleRefresh() {
    AppLocator.context.useCase(RefreshPlaylistUseCase.create()).execute();
  }

  render() {
    return (
      <div>
        {
          this.props.searchBox.isRequesting ? (
            <i
              className={`${fa.fa} ${fa['fa-refresh']} ${fa['fa-lg']} ${fa['fa-spin']} ${styles.button}`}
              title="更新"
            />
          ) : (
            <i
              className={`${fa.fa} ${fa['fa-refresh']} ${fa['fa-lg']} ${styles.hoverButton}`}
              title="更新"
              onClick={::this.handleRefresh}
            />
          )
        }
      </div>
    );
  }
}
