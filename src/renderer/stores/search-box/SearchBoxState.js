export default class SearchBoxState {
  constructor(searchBox = {}) {
    this.word = searchBox.word;
    this.type = searchBox.type;
    this.sort = searchBox.sort;
    this.isRequesting = searchBox ? searchBox.isRequesting : false;
  }
}
