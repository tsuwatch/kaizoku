import {UseCase} from 'almin';
import applicationRepository from '../repositories/ApplicationRepository';

export default class ToggleCommentViewerUseCase extends UseCase {
  static create() {
    return new this({applicationRepository});
  }

  constructor({applicationRepository}) {
    super();

    this.applicationRepository = applicationRepository;
  }

  execute() {
    const application = this.applicationRepository.lastUsed();

    application.commentViewer = !application.commentViewer;
    this.applicationRepository.save(application);
  }
}
