import React from 'react';
import SearchBox from './SearchBox/SearchBox';
import ControlPanel from './ControlPanel/ControlPanel';
import RefreshButton from './RefreshButton/RefreshButton';
import styles from './Header.css';

export default class Header extends React.Component {
  static propTypes = {
    isPlaying: React.PropTypes.bool.isRequired,
    isFullscreen: React.PropTypes.bool.isRequired,
    searchBox: React.PropTypes.object.isRequired,
    favorite: React.PropTypes.object.isRequired
  };

  render() {
    const {searchBox, isPlaying, favorite} = this.props;

    return (
      <div
        style={{display: `${this.props.isFullscreen ? 'none' : ''}`}}
        className={styles.container}
      >
        <RefreshButton searchBox={searchBox} />
        <SearchBox
          searchBox={searchBox}
          favorite={favorite}
        />
        <ControlPanel isPlaying={isPlaying} />
      </div>
    );
  }
}
