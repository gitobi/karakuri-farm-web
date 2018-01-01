import Formatter from './Formatter'

export default class DecimalFormatter extends Formatter {

  /**
   * TODO サブクラスで実装する or ちゃんとしたライブラリを使うｗ
   * @param  {String} format
   */
  constructor(format) {
    super();
    this.placeholder = "00:00:00";
  }

  onChange(originalValue, newValue) {
    // TODO
    return newValue;
  }

  onBlur(originalValue, newValue) {
    // TODO
    return newValue;
  }

}
