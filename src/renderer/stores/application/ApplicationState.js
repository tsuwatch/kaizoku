export default class ApplicationState {
  constructor(application = {}) {
    this.isFullscreen = application.isFullscreen || false;
  }
}
