import { Adapter } from './adapter';

export class AppwriteAdapter extends Adapter {
  store;

  constructor() {
    this.store = {
      rows: [],
    };

    super();
  }
}
