export default class GtbUtils {
  static dateString() {
    var d = new Date();
    var year  = d.getFullYear();
    var month = d.getMonth() + 1;
    var day   = d.getDate();
    var hour  = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
    var min   = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
    var sec   = ( d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();
    return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec
  }

  static round(number, precision=0) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  }

  static find(array, column, value) {
    var a = array.find((element, index, array) => {
      return element[column].toString() === value.toString();
    });
    console.log('find', array, column, value, a);
    return a;
  }

  static findIndex(array, column, value) {
    return array.findIndex((element, index, array) => {
      return element[column].toString() === value.toString();
    });
  }

  /// 一時ID系
  static tmpIdPrefix = 'a';

  static isTmpId(id) {
    return id.toString().startsWith(this.tmpIdPrefix);
  }

  static getTmpId(array) {
    var index = 0;
    while (true) {
      if (!array.includes(this.tmpIdPrefix + index)) {
        break;
      }
      index++;
    }
    return this.tmpIdPrefix + index;
  }
}
