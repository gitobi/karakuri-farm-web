export default class Formatter {

  /**
   * TODO サブクラスで実装する or ちゃんとしたライブラリを使うｗ
   * @param  {String} format
   */
  constructor() {
    this.placeholder = "-";
    this.error = null;
  }

  onChange(originalValue, newValue) {
    return newValue;
  }

  onBlur(originalValue, newValue) {
    return newValue;
  }

}
