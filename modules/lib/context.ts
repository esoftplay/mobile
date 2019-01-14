
import { ContextProvider } from 'recyclerlistview';

export default class ContextHelper extends ContextProvider {

  constructor(uniqueKey: any) {
    super();
    this._contextStore = {};
    this._uniqueKey = uniqueKey;
  }

  getUniqueKey(): any {
    return this._uniqueKey;
  };

  save(key: any, value: any): void {
    this._contextStore[key] = value;
  }

  get(key: any): any {
    return this._contextStore[key];
  }

  remove(key: any): void {
    delete this._contextStore[key];
  }

  _contextStore: any;
  _uniqueKey: any;
}
