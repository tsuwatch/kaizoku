import React from 'react';
import Live from './Live/Live';
import styles from './Playlist.css';

export default class Playlist extends React.Component {
  static propTypes = {
    isFullscreen: React.PropTypes.bool.isRequired,
    playlist: React.PropTypes.object.isRequired
  };

  renderItems() {
    const {playlist} = this.props;

    if (playlist.items.length === 0) return (<p className={styles.empty}>一致する放送が見つかりませんでした</p>);
    return playlist.items.map(item => {
      return (
        <li
          key={item.id}
          className={styles.liveContainer}
        >
          <Live
            item={item}
            selected={item.id === playlist.currentItemId}
          />
        </li>
      )
    });
  }

  render() {
    return (
      <div
        style={{display: `${this.props.isFullscreen ? 'none' : ''}`}}
        className={styles.container}
      >
        <ul className={styles.playlistContent}>
          {this.renderItems()}
        </ul>
      </div>
    );
  }
}
