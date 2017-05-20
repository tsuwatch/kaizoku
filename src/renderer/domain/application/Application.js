import uuid from 'uuid';

export default class Application {
  constructor() {
    this._id = uuid();
    this._isFullscreen = false;
  }

  get isFullscreen() {
    return this._isFullscreen;
  }

  set isFullscreen(isFullscreen) {
    this._isFullscreen = isFullscreen;
  }
}
