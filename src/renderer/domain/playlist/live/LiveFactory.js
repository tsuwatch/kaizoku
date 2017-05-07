import Live from './Live';

export default class LiveFactory {
  static createWithApiData(data) {
    return new Live({
      id: data['contentId'],
      title: data['title'],
      description: data['description'],
      startTime: Date.parse(data['startTime']),
      communityIcon: data['communityIcon'],
      thumbnailUrl: data['thumbnailUrl'],
      commentCounter: data['commentCounter'],
      viewCounter: data['viewCounter'],
      scoreTimeshiftReserved: data['scoreTimeshiftReserved'],
      categoryTags: data['categoryTags'],
      tags: data['tags']
    });
  }

  static createWithAlertData(data) {
    return new Live({
      id: data.contentId,
      title: data.title,
      description: data.description,
      startTime: Date.now(),
      communityIcon: data.thumbnail,
      thumbnailUrl: null,
      commentCounter: '-',
      viewCounter: '-',
      scoreTimeshiftReserved: '-',
      categoryTags: '',
      tags: ''
    });
  }

  static createWithMyPageData(data) {
    return new Live({
      id: data.id,
      title: data.title,
      description: '',
      startTime: null,
      communityIcon: data.communityIcon,
      thumbnailUrl: null,
      commentCounter: '-',
      viewCounter: '-',
      scoreTimeshiftReserved: '-',
      categoryTags: '',
      tags: ''
    });
  }
}
