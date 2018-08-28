import react from '../../../react';
import momentTimeZone from 'moment-timezone'
import moment from 'moment/min/moment-with-locales'
import esp from 'esoftplay';

/*
  CONTOH
  var curl = esp.mod("lib/curl")
  Method GET =>
  new Curl('goal',null,
    (res,msg){
      onDone
    },
    (msg){
      onFailed
    }
  )

  Method POST =>
  var post={
    key1: 'value1',
    key2: 2
  }
  new Curl('goal',post,
    (res,msg){
      onDone
    },
    (msg){
      onFailed
    }
  )

  UPLOAD IMAGE/FILE =>
  curl.upload('goal', 'image' ,fileUri, mimeType(def:'image/jpeg' if null),
    (res,msg){
      onDone
    },
    (msg){
      onFailed
    }
  )
*/


class Ecurl {

  isDebug = esp.config("isDebug")
  url = null
  uri = null
  post = null
  header = {}

  constructor(uri = null, post = null, onDone = null, onFailed = null, debug = 0) {
    if (uri !== null)
      this.init(uri, post, onDone, onFailed, debug)
  }

  upload(uri, postkey = null, fileuri = null, type = null, onDone = null, onFailed = null, debug = 0) {
    postkey = postkey || 'image'
    var uName = fileuri.substring(fileuri.lastIndexOf("/") + 1, fileuri.length)
    var uType = type || "image/jpeg"
    var post = {
      [postkey]: {
        uri: fileuri,
        type: uType,
        name: uName
      }
    }
    this.init(uri, post, onDone, onFailed, debug)
  }

  setUrl(url) {
    this.url = url
  }

  setUri(uri) {
    this.uri = uri
  }

  async init(uri, post, onDone, onFailed, debug) {
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
    await this.setHeader(this.header)
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

  async custom(uri, post, onDone, debug = 0) {
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
      this.setUrl(eps.config("url"))
    }
    await this.setHeader(this.header)
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
    var resJson = (resText.startsWith('{')/*  && resText.endsWith('}')) */ || /* ( */resText.startsWith('[')/* && resText.endsWith(']') */) ? JSON.parse(resText) : null
    if (resJson) {
      if (onDone) onDone(resJson)
      this.onDone(resJson)
    } else {
      if (debug == 1) this.onError(resText)
    }
  }

  onError(msg) {
    esp.log(msg)
  }

  onDone(result, msg) {

  }

  onFailed(msg) {
    //g(msg)
  }

  async setHeader(header) {

  }

  getTimeByTimeZone(timeZone) {
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
    time = parseInt(time)
    var a, b
    for (var i = 0; i < date1.length; i++) {
      a = parseInt(date1[i]);
      b = parseInt(date2[i]);
      if (a > b) {
        time += parseInt(mytimes[i] * (a - b))
      } else {
        time -= parseInt(mytimes[i] * (b - a))
      }
    }
    return time;
  }

  getDayOfYear(d) {
    var date = new Date(d)
    var start = new Date(date.getFullYear(), 0, 0);
    var diff = date - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return day
  }
}

module.exports = Ecurl;
