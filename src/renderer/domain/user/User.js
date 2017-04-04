import uuid from 'uuid';

export default class User {
  constructor() {
    this.id = uuid();
    this._client = null;
  }

  get client() {
    return this._client;
  }

  set client(client) {
    return this._client = client;
  }
}
