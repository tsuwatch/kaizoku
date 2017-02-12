import {EventEmitter} from 'events';

const REPOSITORY_CHANGE = 'REPOSITORY_CHANGE';

export default class BaseRepository extends EventEmitter {
  constructor(domainName, database = new Map()) {
    super();

    this._dataSet = database;
    this._name = domainName;
  }

  _get(id) {
    return this._dataSet.get(`${this._name}.${id}`);
  }

  lastUsed() {
    const item = this._dataSet.get(`${this._name}.lastUsed`);
    if (!item) return;
    return this._get(item.id);
  }

  save(item) {
    this._dataSet.set(`${this._name}.lastUsed`, item);
    this._dataSet.set(`${this._name}.${item.id}`, item);
    this.emit(REPOSITORY_CHANGE, item);
  }

  onChange(handler) {
    this.on(REPOSITORY_CHANGE, handler);
  }
}
