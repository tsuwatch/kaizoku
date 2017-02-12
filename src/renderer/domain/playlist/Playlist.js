import uuid from 'uuid';

export default class Playlist {
  constructor() {
    this.id = uuid();
    this._items = [];
    this._currentItemId = null;
  }

  get items() {
    return this._items;
  }

  set items(items) {
    this._items = items;
  }

  get currentItemId() {
    return this._currentItemId;
  }

  set currentItemId(itemId) {
    this._currentItemId = itemId;
  }

  currentItem() {
    return this.items.find(item => item.id === this.currentItemId);
  }

  play(itemId) {
    if (this.items.length === 0) return;
    this._currentItemId = itemId ? itemId : this.items[0].id;
  }

  stop() {
    this._currentItemId = null;
  }

  playNext() {
    const currentIndex = this.items.findIndex(item => item.id === this.currentItemId);
    const nextItem = this.items[currentIndex + 1];
    this._currentItemId = nextItem ? nextItem.id : null;
  }

  playPrev() {
    const currentIndex = this.items.findIndex(item => item.id === this.currentItemId);
    const prevItem = currentIndex === 0 ? this.items[0] : this.items[currentIndex - 1];
    this._currentItemId = prevItem ? prevItem.id : null;
  }
}
