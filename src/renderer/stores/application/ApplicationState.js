export default class ApplicationState {
  constructor(application = {}) {
    this.commentViewer = application.commentViewer || false;
    this.isFullscreen = application.isFullscreen || false;
    this.screenMode = application.screenMode;
  }
}
