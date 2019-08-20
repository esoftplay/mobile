import moment from "moment/min/moment-with-locales"
import { Linking, Platform, Clipboard, CameraRoll, Share } from "react-native"
import * as FileSystem from 'expo-file-system';
import { esp, LibNavigation } from "esoftplay"
import shorthash from "shorthash"
import { StackActions, NavigationActions } from 'react-navigation';
import { store } from "../../../../App";

export default class eutils {
  static getArgs(props: any, key: string, defOutput?: any): any {
    if (!defOutput) {
      defOutput = "";
    }
    return props
      && props.navigation
      && props.navigation.state
      && props.navigation.state.params
      && props.navigation.state.params[key]
      || defOutput;
  }

  static getReduxState(key: string, ...keys: string[]): any {
    let state: any = store.getState()
    if (key) {
      var _params = [key, ...keys]
      if (_params.length > 0)
        for (let i = 0; i < _params.length; i++) {
          const key = _params[i];
          if (state.hasOwnProperty(key)) {
            state = state[key];
          } else {
            state = {};
          }
        }
    }
    return state;
  }

  static getKeyBackOf(routeName: string, store?: any): string {
    console.warn('LibUtils.getKeyBackOf is deprecated, use LibUtils.navGetKey instead')
    var routes = eutils.getReduxState('user_index', 'routes')
    var keyBack = ""
    for (let i = 0; i < routes.length; i++) {
      const item = routes[i];
      if (item.routeName == routeName) {
        keyBack = item.key
        break
      }
    }
    return keyBack
  }

  static navGetKey(routeName: string): string {
    var routes = eutils.getReduxState('user_index', 'routes')
    var keyNav = ""
    for (let i = 0; i < routes.length; i++) {
      const item = routes[i];
      if (item.routeName == routeName) {
        keyNav = item.key
        break
      }
    }
    return keyNav
  }

  static navReset(navigation: any, isLogin?: boolean): void {
    const home = esp.config('home')
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: isLogin ? home.member : home.public })],
    });
    navigation.dispatch(resetAction);
  }

  static navResetCustom(routeName:string): void {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName })],
    });
    LibNavigation.navigation().dispatch(resetAction);
  }

  static navReplace(store: any, navigation: any, routeName: string, params?: any): void {
    (store.getState().user_index.routes).some((item: any) => item.routeName == routeName) && navigation.goBack(eutils.navGetKey(routeName))
    navigation.navigate(routeName, params)
  }

  static money(value: string | number, currency?: string, part?: number): string {
    if (!value) value = -1
    var val;
    if (typeof value === "number") {
      val = value.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, "$1,")
    } else {
      val = parseInt(value).toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, "$1,")
    }
    if ((typeof value == "string" ? parseInt(value) : value) < 0) {
      return "-"
    }
    if (!currency) {
      currency = "Rp"
    }
    if (typeof val === "number") {
      return currency.replace(/\./g, "") + " " + String(val).replace(/,/g, ".");
    } else {
      return currency.replace(/\./g, "") + " " + val.replace(/,/g, ".");
    }
  }

  static number(toNumber: string | number): string {
    var toNumb = typeof toNumber === "number" ? toNumber.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, "$1,") : parseInt(toNumber).toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, "$1,")
    return String(toNumb).replace(/,/g, ".");
  }

  static countDays(start: string | Date, end: string | Date): number {
    var _start = start instanceof Date ? start.getTime() : new Date(start).getTime()
    var _end = end instanceof Date ? end.getTime() : new Date(end).getTime()
    var diff = Math.abs(_end - _start)
    var oneDay = 1000 * 60 * 60 * 24
    var day = Math.floor(diff / oneDay)
    return day
  }

  static getDateTimeSeconds(start: string | Date, end: string | Date): number {
    var mStart = start instanceof Date ? start : moment(start).toDate()
    var mEnd = end instanceof Date ? end : moment(end).toDate()
    var stampStart = mStart.getTime()
    var stampEnd = mEnd.getTime()
    if (stampStart >= stampEnd) {
      return 0
    } else {
      return Math.round((stampEnd - stampStart) / 1000)
    }
  }

  static ucwords(str: string): string {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  static getCurrentDateTime(format?: string): string {
    if (!format) {
      format = "YYYY-MM-DD kk:mm:ss";
    }
    moment.locale(esp.langId());
    return String(moment(new Date()).format(format))
  }
  static getDateAsFormat(input: string, format?: string): string {
    if (!format) {
      format = "dddd, DD MMMM YYYY";
    }
    moment.locale(esp.langId());
    return moment(input).format(format)
  }
  static telTo(number: string | number): void {
    Linking.openURL("tel:" + number)
  }
  static smsTo(number: string | number, message?: string): void {
    if (!message) {
      message = "";
    }
    var sparator = Platform.OS == "ios" ? "&" : "?"
    Linking.openURL("sms:" + number + sparator + "body=" + message)
  }
  static mailTo(email: string, subject?: string, message?: string): void {
    if (!subject) {
      subject = "";
    }
    if (!message) {
      message = "";
    }
    Linking.openURL("mailto:" + email + "?subject=" + subject + "&body=" + message)
  }
  static waTo(number: string, message?: string): void {
    if (!message) {
      message = "";
    }
    Linking.openURL("https://api.whatsapp.com/send?phone=" + number + "&text=" + encodeURI(message))
  }
  static mapTo(title: string, latlong: string): void {
    Linking.openURL((Platform.OS === "ios" ? "http://maps.apple.com/?q=" + title + "&ll=" : "http://maps.google.com/maps?q=loc:") + latlong + "(" + title + ")")
  }
  static copyToClipboard(string: string): Promise<any> {
    return new Promise((r, j) => {
      Clipboard.setString(string)
      r(true)
    })
  }
  static colorAdjust(hex: string, lum: number): string {
    hex = hex.replace(/[^0-9a-f]/gi, "");
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;
    var rgb = "#",
      c, i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00" + c).substr(c.length);
    }
    return rgb;
  }

  static escapeRegExp(str: string): string {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

  static hexToRgba(hex: string, alpha: number): string {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => { return r + r + g + g + b + b; });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return "rgba(" + parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + "," + alpha + ")"
  }

  static async download(url: string, onDownloaded: (file: string) => void): Promise<any> {
    const config = esp.config();
    try { await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + config.domain, { intermediates: true }) } catch (error) { }
    var fileExtentions = url.split(".").pop();
    var fileName = shorthash.unique(url)
    FileSystem.downloadAsync(
      url,
      FileSystem.documentDirectory + config.domain + "/" + fileName + "." + fileExtentions)
      .then(({ uri }) => {
        CameraRoll.saveToCameraRoll(uri, "photo")
        onDownloaded(fileName + fileExtentions)
      }).catch((error: any) => { });
  }

  static share(message: string): void {
    Share.share({
      url: message,
      message: message,
    });
  }
}