import {UseCase} from 'almin';
import {ipcRenderer} from 'electron';
import LiveFactory from '../domain/playlist/live/LiveFactory';
import cheerio from 'cheerio';
import request from 'request';
import searchBoxRepository from '../repositories/SearchBoxRepository';
import playlistRepository from '../repositories/PlaylistRepository';

export default class ViewRankingUseCase extends UseCase {
  static create() {
    return new this({searchBoxRepository, playlistRepository});
  }

  constructor({searchBoxRepository, playlistRepository}) {
    super();

    this.searchBoxRepository = searchBoxRepository;
    this.playlistRepository = playlistRepository;
  }

  execute(mode) {
    const searchBox = this.searchBoxRepository.lastUsed();
    const playlist = this.playlistRepository.lastUsed();
    searchBox.isRequesting = true;
    searchBox.mode = `${mode}_ranking`;
    this.searchBoxRepository.save(searchBox);

    return this._fetch()
      .then(body => {
        const resultItems = this._extractRanking(mode, body);
        const filteredItems = resultItems.filter(item => !playlist.pinnedItems().map(item => item.id).includes(item.id));
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
        url: 'http://live.nicovideo.jp/ranking',
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

  _extractRanking(mode, body) {
    const $ = cheerio.load(body);
    if (mode === 'user') {
      const rankingVideo = $('.ranking_video');
      return rankingVideo.map((i, el) => {
        return LiveFactory.createWithRankingData(this._extractUserRanking($(el)))
      });
    } else if (mode === 'official') {
      const rank = $('#rank > .active');
      return rank.children().map((i, el) => {
        return LiveFactory.createWithRankingData(this._extractOfficialRanking($(el)))
      });
    }
  }

  _extractUserRanking(el) {
    const data = {};
    data['id'] = el.find('.title').attr('href').match(/lv[0-9]*/)[0];
    data['title'] = el.find('.video_title').text();
    data['communityIcon'] = el.find('a > img').attr('src');
    data['commentCounter'] = el.find('.coment').text();
    data['viewCounter'] = el.find('.audience').text();
    return data;
  }

  _extractOfficialRanking(el) {
    const data = {};
    data['id'] = el.find('p > a').attr('href').match(/lv[0-9]*/)[0];
    data['title'] = el.find('.detail > p > a').text();
    data['communityIcon'] = el.find('a > img').attr('src');
    data['commentCounter'] = el.find('.coment').text();
    data['viewCounter'] = el.find('.audience').text();
    return data;
  }
}
