import {
  Linking,
  Platform,
  Clipboard
} from '../../../../node_modules/react-native/Libraries/react-native/react-native-implementation.js';
import moment from 'moment/min/moment-with-locales'

class Eutils {
  static getArgs = (props, key, defOutput = '') => {
    out = defOutput;
    if (props) {
      if (props.navigation) {
        if (props.navigation.state) {
          if (props.navigation.state.params) {
            if (props.navigation.state.params[key]) {
              out = props.navigation.state.params[key]
            }
          }
        }
      }
    }
    return out;
  }
  static navReplace(store, navigation, routeName, params) {
    (store.getState().nav.routes).some((item) => item.routeName == routeName) && navigation.goBack(utils.getKeyBackOf(routeName, store))
    navigation.navigate(routeName, params)
  }
  static getKeyBackOf(routeName, store) {
    var routes = store.getState().nav.routes
    var keyBack = ''
    for (let i = 0; i < routes.length; i++) {
      const item = routes[i];
      if (item.routeName == routeName) {
        keyBack = item.key
        break
      }
    }
    return keyBack
  }
  static money(value = -1, currency, part = 0) {
    if (value === -1 && parseInt(currency) > 0) {
      value = currency
    }
    value = parseInt(value)
    if (part > 0 || currency != 'IDR' || currency != 'Rp') {
      //   part = (part || 0)
      //   value = value.toFixed(part).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
      // } else {
      value = value.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1,')
    }
    if (value < 0) {
      return "-"
    }
    if (currency == undefined) {
      currency = "Rp"
    }
    return currency.replace(/\./g, '') + ' ' + value.replace(/,/g, '.')
  }
  static number(toNumber) {
    toNumber = parseInt(toNumber)
    toNumber = toNumber.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1,')
    return toNumber
  }
  static countDays(start, end) {
    var start = start instanceof Date ? start : new Date(start)
    var end = end instanceof Date ? end : new Date(end)
    var diff = Math.abs(end - start)
    var oneDay = 1000 * 60 * 60 * 24
    var day = Math.floor(diff / oneDay)
    return day
  }
  static getDateTimeSeconds(start, end) {
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
  static ucwords(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  static getCurrentDateTime(format = 'YYYY-MM-DD kk:mm:ss') {
    moment.locale('id')
    return String(moment(new Date()).format(format))
  }
  static getDateAsFormat(input, format = 'dddd, DD MMMM YYYY') {
    return moment(input).format(format)
  }
  static telTo(number = '') {
    Linking.openURL('tel:' + number)
  }
  static smsTo(number = '', message = '') {
    var sparator = Platform.OS == 'ios' ? '&' : '?'
    Linking.openURL('sms:' + number + sparator + 'body=' + message)
  }
  static mailTo(email = '', subject = '', message = '') {
    Linking.openURL('mailto:' + email + '?subject=' + subject + '&body=' + message)
  }
  static waTo(number = '', message = '') {
    Linking.openURL('https://api.whatsapp.com/send?phone=' + number + '&text=' + encodeURI(message))
  }
  static mapTo(title = '', latlong) {
    Linking.openURL((Platform.OS === 'ios' ? 'http://maps.apple.com/?q=' + title + '&ll=' : 'http://maps.google.com/maps?q=loc:') + latlong + '(' + title + ')')
  }
  static copyToClipboard(string, callback = () => { }) {
    Clipboard.setString(string)
    callback()
  }
  static colorAdjust(hex, lum) {
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
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

  static escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

}
module.exports = Eutils