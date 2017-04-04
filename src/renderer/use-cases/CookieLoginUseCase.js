import {UseCase} from 'almin';
import {ipcRenderer} from 'electron';
import NicoliveAPI from 'nicolive-api';
import User from '../domain/user/User';
import userRepository from '../repositories/UserRepository';
import SessionExtractor from '../libraries/SessionExtractor';

export default class CookieLoginUseCase extends UseCase {
  static create() {
    return new this({userRepository});
  }

  constructor({userRepository}) {
    super();

    this.userRepository = userRepository;
  }

  execute() {
    const user = new User();
    const sessionExtractor = new SessionExtractor();

    return new Promise((resolve, reject) => {
      sessionExtractor.extract()
        .then(sessionId => {
          user.client = new NicoliveAPI(`user_session=${sessionId}`);
          const returnValue = ipcRenderer.sendSync('RequestSetCookie', user.client.cookie.split('=')[1].replace(/;/, ''));
          if (returnValue) reject(returnValue);
          this.userRepository.save(user);
          resolve();
        })
        .catch(err => reject(err));
    });
  }
}
