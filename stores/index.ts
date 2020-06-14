import { Stringify } from '../utils';
import Api from './api';
import Auth from './auth';
import User from './user';
import Movie from './movie';

declare global {
  interface Window {
    store: Store;
  }
}

export default class Store {
  public api = new Api(this);
  public auth = new Auth(this);
  public movie = new Movie(this);
  public user = new User(this);


  [name: string]: any;

  public export = (): string => Stringify(this);


  public import = (data: string) =>
    Object.entries(JSON.parse(data)).forEach(([storeName, store]: any) =>
      Object.entries(store).forEach(([variableName, value]) => {
        if (variableName !== 'store')      /// to handle the circular structure of out store architecture. (circularity is the because of sharing store itself to child objects)
          this[storeName][variableName] = value;
      })
    );
}


