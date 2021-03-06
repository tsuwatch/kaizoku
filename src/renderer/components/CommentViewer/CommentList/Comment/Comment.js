import React from 'react';
import {shell} from 'electron';
import styles from './Comment.css';

export default class Comment extends React.Component {
  static propTypes = {
    comment: React.PropTypes.object.isRequired,
    widths: React.PropTypes.array.isRequired
  };

  getRoomBackgroundColor(label) {
    if (/アリーナ|c[oh]/.test(label)) return '#3c49ff';
    switch (label) {
      case '立ち見1':
        return '#ff3c37';
      case '立ち見2':
        return '#b2ae00';
      case '立ち見3':
        return '#24c10e';
      case '立ち見4':
        return '#f577cd';
      case '立ち見5':
        return '#2eb9c8';
      case '立ち見6':
        return '#f97900';
      case '立ち見7':
        return '#8600d8';
      case '立ち見8':
        return '#006b42';
      case '立ち見9':
        return '#ac1200';
      case '立ち見10':
        return '#ababab';
      default:
        return 'black';
    }
  }

  render() {
    const {comment, widths} = this.props;

    return (
      <div className={styles.row}>
        <div
          className={styles.room}
          style={{
            width: `${widths[0].width}px`,
            background: this.getRoomBackgroundColor(comment.room.label)
          }}
        >
          {
            comment.room.shortLabel === '' ? (
              comment.room.label
            ) : (`${comment.room.shortLabel}: ${comment.attr.no}`)
          }
        </div>
        <div
          className={styles.text}
          style={{
            width: `${widths[1].width + 10}px`,
            fontWeight: comment.isFirst ? 'bold' : 'normal'
          }}
        >
          {comment.text}
        </div>
        <div
          className={styles.user}
          style={{width: `${widths[2].width + 10}px`}}
        >
          {comment.attr.anonymity === '1' ? null : <span className={styles.id}>ID</span>}
          {
            comment.attr.anonymity === '1' ? (
              comment.attr.user_id
            ) : (
              <span
                className={styles.link}
                onClick={() => shell.openExternal(`http://www.nicovideo.jp/user/${comment.attr.user_id}`)}
              >
                {comment.attr.user_id}
              </span>
            )
          }
        </div>
      </div>
    );
  }
}
