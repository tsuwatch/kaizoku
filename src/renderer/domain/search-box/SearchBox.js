import uuid from 'uuid';

export default class SearchBox {
  constructor() {
    this._id = uuid();
    this._word = '';
    this._type = 'word';
    this._sort = '-startTime';
    this._mode = 'search';
    this._isRequesting = false;
  }

  get word() {
    return this._word;
  }

  get type() {
    return this._type;
  }

  get sort() {
    return this._sort;
  }

  get mode() {
    return this._mode;
  }

  get isRequesting() {
    return this._isRequesting;
  }

  set word(word) {
    this._word = word;
  }

  set type(type) {
    this._type = type;
  }

  set sort(sort) {
    this._sort = sort;
  }

  set mode(mode) {
    this._mode = mode;
  }

  set isRequesting(isRequesting) {
    this._isRequesting = isRequesting;
  }
}
