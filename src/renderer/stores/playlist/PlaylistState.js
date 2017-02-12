export default class PlaylistState {
  constructor(playlist = {}) {
    this.items = playlist.items;
    this.currentItemId = playlist.currentItemId;
    this.currentItem = playlist.currentItemId ? playlist.currentItem() : null;
  }
}
