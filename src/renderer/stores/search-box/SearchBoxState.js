export default class SearchBoxState {
  constructor(searchBox = {}) {
    this.word = searchBox.word;
    this.type = searchBox.type;
    this.sort = searchBox.sort;
    this.mode = searchBox.mode;
    this.isRequesting = searchBox ? searchBox.isRequesting : false;
  }
}
