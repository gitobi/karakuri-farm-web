export default class GtbUtils {
  static dateString(date=null) {
    var d = (null === date) ? new Date() : date;
    var year  = d.getFullYear();
    var month = ( d.getMonth() + 1 < 10 ) ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
    var day   = ( d.getDate()      < 10 ) ? '0' + d.getDate()        : d.getDate();
    var hour  = ( d.getHours()     < 10 ) ? '0' + d.getHours()       : d.getHours();
    var min   = ( d.getMinutes()   < 10 ) ? '0' + d.getMinutes()     : d.getMinutes();
    var sec   = ( d.getSeconds()   < 10 ) ? '0' + d.getSeconds()     : d.getSeconds();
    return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec
  }

  static round(number, precision=0) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  }

  static find(array, column, value) {
    return array.find((element, index, array) => {
      return element[column].toString() === value.toString();
    });
  }

  static findIndex(array, column, value) {
    return array.findIndex((element, index, array) => {
      return element[column].toString() === value.toString();
    });
  }

  static clear(array) {
    array.splice(0, array.length);
  }

  static copy(src, dst) {
    if (null === dst) {
      dst = [];
    }
    this.clear(dst)
    Object.assign(dst , src);
    return dst;
  }

  static equivalent(src, dst) {
    return JSON.stringify(src) === JSON.stringify(dst);
  }

  /// 一時ID系
  static tmpIdDigits = '4';
  static tmpIdSuffix = 'a';

  static zeroPadding(num, length){
      return ('0000000000' + num).slice(-length);
  }

  static isTmpId(id) {
    return id.toString().endsWith(this.tmpIdSuffix);
  }

  static createTmpId(number) {
    return this.zeroPadding(number, this.tmpIdDigits) + this.tmpIdSuffix;
  }

  static getTmpId(array) {
    var index = 0;
    var tmpId;
    while (true) {
      tmpId = this.createTmpId(index);
      if (!array.includes(tmpId)) {
        break;
      }
      index++;
    }
    return tmpId;
  }
}
