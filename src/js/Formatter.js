export default class Formatter {

  /**
   * TODO サブクラスで実装する or ちゃんとしたライブラリを使うｗ
   * @param  {String} format
   */
  constructor(format) {
    switch(format) {
      case "decimal":
        this.placeholder = "0.0";
        this.formatter = Formatter.decimal;
        break;

      case "time":
        this.placeholder = "00:00:00";
        this.formatter = Formatter.time;
        break;

      default:
        this.placeholder = "-";
        this.formatter = Formatter.none;
        break;
    }
  }

  format(originalValue, newValue) {
    return this.formatter(originalValue, newValue);
  }

  static none(originalValue, newValue) {
    return {value: newValue, error: null};
  }

  static decimal(originalValue, newValue) {
    // console.log('originalValue:', originalValue, 'newValue:', newValue)
    if (!newValue) {
      return {value: null, error: null};
    }

    let pattern = /^\d*(\.\d*)?$/;
    if (pattern.test(newValue)) {
      // console.log('format ok');
      return {value: newValue, error: null};
    } else {
      // console.log('format error');
      return {value: originalValue, error: '半角整数、または、半角少数を入力してください。'};
    }
  }

  static time(originalValue, newValue) {
    // TODO
    return {value: newValue, error: null};
  }
}
