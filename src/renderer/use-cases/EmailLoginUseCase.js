import {UseCase} from 'almin';
import {ipcRenderer} from 'electron';
import nicolive from 'nicolive-api';
import User from '../domain/user/User';
import userRepository from '../repositories/UserRepository';

export default class EmailLoginUseCase extends UseCase {
  static create() {
    return new this({userRepository});
  }

  constructor({userRepository}) {
    super();

    this.userRepository = userRepository;
  }

  execute({email, password}) {
    const user = new User();

    return new Promise((resolve, reject) => {
      nicolive.login({email, password})
        .then(client => {
          user.client = client;
          const returnValue = ipcRenderer.sendSync('RequestSetCookie', client.cookie.split('=')[1].replace(/;/, ''));
          if (returnValue) reject(returnValue);
          this.userRepository.save(user);
          resolve();
        })
        .catch(err => reject(err));
    });
  }
}
