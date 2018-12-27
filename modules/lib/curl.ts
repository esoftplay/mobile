// 
import react from 'react';
import momentTimeZone from 'moment-timezone'
import moment from 'moment/min/moment-with-locales'
import { esp, LibCrypt } from 'esoftplay';

export default class ecurl {
  isDebug = esp.config('isDebug');
  post: any;
  header: any;
  url: any;
  uri: any;

  constructor(uri?: string, post?: any, onDone?: (res: any, msg: string) => void, onFailed?: (msg: string) => void, debug?: number) {
    this.setUri = this.setUri.bind(this);
    this.setUrl = this.setUrl.bind(this);
    this.header = {}
    this.setHeader = this.setHeader.bind(this);
    if (uri) {
      this.init(uri, post, onDone, onFailed, debug);
    }
  }

  setUrl(url: string): void {
    this.url = url
  }

  setUri(uri: string): void {
    this.uri = uri
  }

  setHeader(): void {
    if ((/:\/\/data.*?\/(.*)/g).test(this.url)) {
      this.header['masterkey'] = new LibCrypt().encode(this.url)
    }
  }


  onDone(result: any, msg?: string): void {

  }

  onFailed(msg: string): void {

  }

  upload(uri: string, postKey: string, fileUri: string, mimeType: string, onDone?: (res: any, msg: string) => void, onFailed?: (msg: string) => void, debug?: number): void {
    postKey = postKey || 'image';
    var uName = fileUri.substring(fileUri.lastIndexOf('/') + 1, fileUri.length);
    var uType = mimeType || 'image/jpeg'
    var post = { [postKey]: { uri: fileUri, type: uType, name: uName } }
    this.init(uri, post, onDone, onFailed, debug)
  }

  async custom(uri: string, post?: any, onDone?: (res: any) => void, debug?: number): Promise<void> {
    if (post) {
      let fd = new FormData();
      Object.keys(post).map(function (key) {
        if (key !== undefined) {
          if (post[key] !== '') {
            fd.append(key, post[key])
          }
        }
      });
      this.post = fd
    }
    this.setUri(uri)
    if ((/^[A-z]+:\/\//g).test(uri)) {
      this.setUrl(uri)
      this.setUri('')
    } else {
      this.setUrl(esp.config("url"))
    }
    await this.setHeader()
    var options = {
      method: this.post === null ? 'GET' : 'POST',
      headers: this.header,
      body: this.post
    }
    if (debug == 1)
      esp.log(this.url + this.uri, options)
    var res
    res = await fetch(this.url + this.uri, options)
    var resText = await res.text()
    var resJson = (resText.startsWith('{') || resText.startsWith('[')) ? JSON.parse(resText) : null
    if (resJson) {
      if (onDone) onDone(resJson)
      this.onDone(resJson)
    } else {
      if (debug == 1) this.onError(resText)
    }
  }

  async init(uri: string, post?: any, onDone?: (res: any, msg: string) => void, onFailed?: (msg: string) => void, debug?: number): Promise<void> {
    if (post) {
      let fd = new FormData();
      Object.keys(post).map(function (key) {
        if (key !== undefined) {
          fd.append(key, post[key])
        }
      });
      this.post = fd
    }
    this.setUri(uri)
    if ((/^[A-z]+:\/\//g).test(uri)) {
      this.setUrl(uri)
      this.setUri('')
    } else {
      this.setUrl(esp.config("url"))
    }

    await this.setHeader();
    var options = {
      method: this.post === null ? 'GET' : 'POST',
      headers: this.header,
      body: this.post
    }
    if (debug == 1) esp.log(this.url + this.uri, options)
    // console.log(this.url + uri, options)
    var res = await fetch(this.url + this.uri, options)
    var resText = await res.text()
    var resJson = (resText.startsWith('{') && resText.endsWith('}')) || (resText.startsWith('[') && resText.endsWith(']')) ? JSON.parse(resText) : resText
    if (typeof resJson == 'object') {
      if (resJson.ok === 1) {
        if (onDone) onDone(resJson.result, resJson.message)
        this.onDone(resJson.result, resJson.message)
      } else {
        if (onFailed) onFailed(resJson.message)
        this.onFailed(resJson.message)
      }
    } else {
      if (debug == 1) this.onError(resText)
    }
  }

  onError(msg: string): void {
    esp.log(msg)
  }

  getTimeByTimeZone(timeZone: string): number {
    var mytimes = [86400, 3600, 60, 1]
    var date1 = [], date2 = []
    var dateFormat = 'H-m-s'
    var dt1 = momentTimeZone.tz(new Date(), timeZone)
    var dt2 = moment(new Date())
    date1.push(this.getDayOfYear(dt1))
    date2.push(this.getDayOfYear(dt2))
    date1.push(...dt1.format(dateFormat).split('-'))
    date2.push(...dt2.format(dateFormat).split('-'))
    var time = (new Date()).getTime();
    var a, b
    for (var i = 0; i < date1.length; i++) {
      a = parseInt(date1[i]);
      b = parseInt(date2[i]);
      if (a > b) {
        time += mytimes[i] * (a - b)
      } else {
        time -= mytimes[i] * (b - a)
      }
    }
    return time;
  }

  getDayOfYear(d: string): number {
    var date = new Date(d);
    var start = new Date(date.getFullYear(), 0, 0);
    var diff = date.getMilliseconds() - start.getMilliseconds();
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return day
  }
}
