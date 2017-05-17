import {UseCase} from 'almin';
import {ipcRenderer} from 'electron';
import LiveFactory from '../domain/playlist/live/LiveFactory';
import cheerio from 'cheerio';
import request from 'request';
import searchBoxRepository from '../repositories/SearchBoxRepository';
import playlistRepository from '../repositories/PlaylistRepository';

export default class ViewMyPageUseCase extends UseCase {
  static create() {
    return new this({searchBoxRepository, playlistRepository});
  }

  constructor({searchBoxRepository, playlistRepository}) {
    super();

    this.searchBoxRepository = searchBoxRepository;
    this.playlistRepository = playlistRepository;
  }

  extractData(el) {
    const data = {};
    const link = el.find('h3 > a');
    data['id'] = link.attr('href').match(/lv[0-9]*/)[0];
    data['title'] = link.attr('title');
    data['communityIcon'] = el.find('a > img').attr('src');
    return data;
  }

  execute() {
    const searchBox = this.searchBoxRepository.lastUsed();
    const playlist = this.playlistRepository.lastUsed();
    searchBox.isRequesting = true;
    searchBox.mode = 'my';
    this.searchBoxRepository.save(searchBox);

    return this._fetch()
      .then(body => {
        const $ = cheerio.load(body);
        const favoriteList = $('#Favorite_list');

        const liveItems = favoriteList.find('#subscribeItemsWrap').children('.liveItems').children();
        const items1 = liveItems.map((i, el) => {
          return LiveFactory.createWithMyPageData(this.extractData($(el)));
        });

        let items2 = [];
        const liveItemsList = favoriteList.find('#all_subscribeItemsWrap').children('.liveItems');
        if (liveItemsList.length) {
          const itemsList = liveItemsList.map((i, el) => {
            return $(el).children().map((j, el2) => {
              return LiveFactory.createWithMyPageData(this.extractData($(el2)));
            });
          });
          items2 = itemsList.toArray().reduce((a, b) => {
            const aArray = Array.isArray(a) ? a : a.toArray();
            const bArray = Array.isArray(b) ? b : b.toArray();
            return aArray.concat(bArray);
          });
        }

        const filteredItems = [...items1, ...items2].filter(item => !playlist.pinnedItems().map(item => item.id).includes(item.id));
        const items = [...playlist.pinnedItems(), ...filteredItems];
        if (playlist.currentItem() && !items.find(item => item.id === playlist.currentItemId)) items.unshift(playlist.currentItem());
        playlist.items = items;
        this.playlistRepository.save(playlist);
        searchBox.isRequesting = false;
        this.searchBoxRepository.save(searchBox);
      })
      .catch(err => {
        searchBox.isRequesting = false;
        this.searchBoxRepository.save(searchBox);
        return Promise.reject(err);
      });
  }

  _fetch() {
    return new Promise((resolve, reject) => {
      request({
        url: 'http://live.nicovideo.jp/my',
        headers: {
          cookie: `user_session=${ipcRenderer.sendSync('RequestGetCookie')}`
        }
      }, (err, res, body) => {
        if (err) return reject(err);
        if (res.headers['x-niconico-authflag'] === '0') return reject('notlogin');
        resolve(body);
      });
    });
  }
}
