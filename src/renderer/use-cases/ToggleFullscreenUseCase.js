import {UseCase} from 'almin';
import applicationRepository from '../repositories/ApplicationRepository';

export default class ToggleFullscreenUseCase extends UseCase {
  static create() {
    return new this({applicationRepository});
  }

  constructor({applicationRepository}) {
    super();

    this.applicationRepository = applicationRepository;
  }

  execute() {
    const application = this.applicationRepository.lastUsed();

    application.isFullscreen = !application.isFullscreen;
    this.applicationRepository.save(application);
  }
}
