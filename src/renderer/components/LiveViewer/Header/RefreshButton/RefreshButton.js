import React from 'react';
import fa from 'font-awesome/css/font-awesome.css';
import AppLocator from '../../../../AppLocator';
import RefreshPlaylistUseCase from '../../../../use-cases/RefreshPlaylistUseCase';
import ViewMyPageUseCase from '../../../../use-cases/ViewMyPageUseCase';
import styles from './RefreshButton.css';

export default class RefreshButton extends React.Component {
  static propTypes = {
    searchBox: React.PropTypes.object.isRequired,
  }

  handleRefresh() {
    const {searchBox} = this.props;

    if (searchBox.isRequesting) return;

    if (searchBox.mode === 'search') {
      AppLocator.context.useCase(RefreshPlaylistUseCase.create()).execute();
    } else if (searchBox.mode === 'my') {
      AppLocator.context.useCase(ViewMyPageUseCase.create()).execute();
    }
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
