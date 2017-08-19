import uuid from 'uuid';

export default class Application {
  constructor() {
    this._id = uuid();
    this._commentViewer = false;
    this._isFullscreen = false;
  }

  get isFullscreen() {
    return this._isFullscreen;
  }

  get commentViewer() {
    return this._commentViewer;
  }

  get screenMode() {
    if (this._isFullscreen) {
      return 'fullscreen';
    } else {
      if (this._commentViewer) {
        return 'commentViewer';
      } else {
        return 'playlist';
      }
    }
  }

  set isFullscreen(isFullscreen) {
    this._isFullscreen = isFullscreen;
  }

  set commentViewer(commentViewer) {
    this._commentViewer = commentViewer;
  }
}
