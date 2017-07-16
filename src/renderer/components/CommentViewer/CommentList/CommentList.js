import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import styles from './CommentList.css';
import Comment from './Comment/Comment';

export default class CommentList extends React.Component {
  static propTypes = {
    comments: React.PropTypes.array.isRequired
  };

  constructor() {
    super();

    this.state = {
      moving: false,
      targetIndex: null,
      widths: [
        {
          min: 30,
          max: 100,
          width: 70
        },
        {
          min: 100,
          max: 400,
          width: 300
        },
        {
          min: 100,
          max: 200,
          width: 150
        }
      ]
    };
  }

  renderComments() {
    return this.props.comments.map((comment, i) => (
      <Comment
        key={`${comment.attr.thread}-${comment.attr.user_id}-${comment.attr.no ? comment.attr.no : i}`}
        comment={comment}
        widths={this.state.widths}
      />
    ));
  }

  handleDown(targetIndex) {
    this.setState({moving: true, targetIndex});
  }

  handleMove(e) {
    e.preventDefault();

    if (this.state.moving) {
      const {targetIndex} = this.state;
      const widths = cloneDeep(this.state.widths);
      let width = widths[targetIndex];
      width.width = e.clientX + this.container.scrollLeft - 5; // margin
      // 自分より前の幅を減算
      for (let i=targetIndex; i>0; i--) {
        const j = i - 1;
        width.width -= widths[j].width;
        width.width -= 10; // separatorの幅
      }
      if (width.width <= width.min) width.width = width.min;
      if (width.width >= width.max) width.width = width.max;
      widths[targetIndex] = width;
      this.setState({widths});
    }
  }

  handleUp() {
    this.setState({moving: false, targetIndex: null});
  }

  render() {
    return (
      <div>
        <div ref={(ref => this.container = ref)}>
          <div className={styles.headerWrapper}>
            <div
              className={styles.header}
              onMouseMove={::this.handleMove}
              onMouseUp={::this.handleUp}
            >
              <span
                className={styles.headerCell}
                style={{
                  width: `${this.state.widths[0].width}px`,
                  minWidth: `${this.state.widths[0].min}px`,
                  maxWidth: `${this.state.widths[0].max}px`
                }}
              >
                部屋
              </span>
              <span
                className={styles.separator}
                onMouseDown={() => this.handleDown(0)}
              />
              <span
                className={styles.headerCell}
                style={{
                  width: `${this.state.widths[1].width}px`,
                  minWidth: `${this.state.widths[1].min}px`,
                  maxWidth: `${this.state.widths[1].max}px`
                }}
              >
                コメント
              </span>
              <span
                className={styles.separator}
                onMouseDown={() => this.handleDown(1)}
              />
              <span
                className={styles.headerCell}
                style={{
                  width: `${this.state.widths[2].width}px`,
                  minWidth: `${this.state.widths[2].min}px`,
                  maxWidth: `${this.state.widths[2].max}px`
                }}
              >
                ユーザID
              </span>
              <span
                className={styles.separator}
                onMouseDown={() => this.handleDown(2)}
              />
            </div>
          </div>
        </div>
        <div>
          {this.renderComments()}
        </div>
      </div>
    )
  }
}
