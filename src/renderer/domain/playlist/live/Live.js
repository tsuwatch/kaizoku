export default class Live {
  constructor({
    id,
    title,
    description,
    startTime,
    communityIcon,
    thumbnailUrl,
    commentCounter,
    viewCounter,
    scoreTimeshiftReserved,
    categoryTags,
    tags
  } = {}) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.startTime = startTime;
    this.communityIcon = communityIcon;
    this.thumbnailUrl = thumbnailUrl;
    this.commentCounter = commentCounter;
    this.viewCounter = viewCounter;
    this.scoreTimeshiftReserved = scoreTimeshiftReserved;
    this.categoryTags = categoryTags;
    this.tags = tags;
    this.url = `http://live.nicovideo.jp/watch/${this.id}`;
    this.pinned = false;
  }
}
