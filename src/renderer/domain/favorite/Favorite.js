import uuid from 'uuid';

export default class Favorite {
  constructor({
    _items
  } = {}) {
    this.id = uuid();
    this._items = _items;
  }

  get items() {
    return this._items;
  }

  add(searchBox) {
    this.items.push({
      word: searchBox.word,
      type: searchBox.type,
      sort: searchBox.sort
    });
  }

  remove(searchBox) {
    const items = this.items.filter(item => item.type !== searchBox.type || item.word !== searchBox.word)
    this._items = items;
  }
}
