import moment from 'moment';

export default class GtbUtils {
  static dateStringWithinTimezone(date) {
    let d = moment(date);
    return d.format();
  }

  static dateString(date) {
    let d = moment(date);
    return d.format("YYYY/MM/DD HH:mm:ss");
  }

  static ymdString(date) {
    let d = moment(date);
    return d.format("YYYY/MM/DD");
  }

  static hhmmString(date) {
    let d = moment(date);
    return d.format("HH:mm");
  }

  // static dateString(date=null) {
  //   var d = (null === date) ? new Date() : date;
  //   var year  = d.getFullYear();
  //   var month = ( d.getMonth() + 1 < 10 ) ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
  //   var day   = ( d.getDate()      < 10 ) ? '0' + d.getDate()        : d.getDate();
  //   var hour  = ( d.getHours()     < 10 ) ? '0' + d.getHours()       : d.getHours();
  //   var min   = ( d.getMinutes()   < 10 ) ? '0' + d.getMinutes()     : d.getMinutes();
  //   var sec   = ( d.getSeconds()   < 10 ) ? '0' + d.getSeconds()     : d.getSeconds();
  //   return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec
  // }

  // static ymdString(date=null) {
  //   var d = (null === date) ? new Date() : date;
  //   var year  = d.getFullYear();
  //   var month = ( d.getMonth() + 1 < 10 ) ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
  //   var day   = ( d.getDate()      < 10 ) ? '0' + d.getDate()        : d.getDate();
  //   return year + '-' + month + '-' + day;
  // }

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

  static objectSort(obj) {
    if (null === obj || undefined === obj) {
      return obj;
    }

    // まずキーのみをソートする
    let keys = Object.keys(obj).sort();

    // 返却する空のオブジェクトを作る
    let map = {};
    // ソート済みのキー順に返却用のオブジェクトに値を格納する
    keys.forEach((key) => {
        let val = obj[key];
        // 中身がオブジェクトの場合は再帰呼び出しを行う
        if(typeof val === "object"){
            val = this.objectSort(val);
        }
        map[key] = val;
    });
    return map;
  }

  static compare(obj1, obj2) {
    let j1 = JSON.stringify(this.objectSort(obj1));
    let j2 = JSON.stringify(this.objectSort(obj2));
    // console.log("compare:", j1, j2);
    return (j1 === j2);
  }

  /**
   * [findOrHead description]
   * @param  {[type]} array  [description]
   * @param  {[type]} column [description]
   * @param  {[type]} value  [description]
   * @return {[type]}        [description]
   *
   * listの初期表示、またはlistの要素が変更された時に、先頭の要素を選択するためのメソッド。
   *
   * 初期表示（valueがnull）の場合は、先頭要素のcolumn値を返却する。
   * ```js
   * array=[{id: '1' , id: '2'}]
   * column='id'
   * value=null
   * findOrHead(array, column, value) # '1'
   * ```
   *
   * listの内容が変更された場合、
   * 先程まで選択されていた要素が存在する場合は同じ値を、
   * 存在しなくなった場合は先頭要素のcolumn値を返却する。
   * ```js
   * array=[{id: '1' , id: '3'}]
   * column='id'
   * value='2'
   * findOrHead(array, column, value) # '1'
   *
   * array=[{id: '1' , id: '2', id: '3'}]
   * column='id'
   * value='2'
   * findOrHead(array, column, value) # '2'
   * ```
   *
   * listが空またはnullの場合は、nullを返却する。
   * ```js
   * array=[]
   * column='id'
   * value='2'
   * findOrHead(array, column, value) # null
   *
   * array=null
   * column='id'
   * value='2'
   * findOrHead(array, column, value) # null
   * ```
   */
  static findOrHead(array, column, value) {
    if (array === null || array.length === 0) {
      return null;
    }

    if (value === null) {
      return array[0][column];
    }

    let item = this.find(array, column, value);
    if (item === null) {
      return array[0][column];
    }

    return item[column]
  }
}
