import {Context, Dispatcher} from 'almin';
import AppStoreGroup from './stores/AppStoreGroup';

export class AppLocator {
  constructor() {
    this.context = new Context({
      dispatcher: new Dispatcher(),
      store: AppStoreGroup.create()
    });
  }
}

export default new AppLocator();
