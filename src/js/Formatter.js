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
    return newValue;
  }
  static decimal(originalValue, newValue) {
    // TODO
    return newValue;
  }
  static time(originalValue, newValue) {
    // TODO
    return newValue;
  }
}
