import Formatter from './Formatter'

export default class DecimalFormatter extends Formatter {

  /**
   * TODO サブクラスで実装する or ちゃんとしたライブラリを使うｗ
   * @param  {String} format
   */
  constructor() {
    super();
    this.placeholder = "0.0";
  }

  checkFormat(value) {
    if (!value) {
      return true;
    }

    let pattern = /^\d*(\.\d*)?$/;
    if (pattern.test(value)) {
      // console.log('format ok');
      return true;
    } else {
      // console.log('format error');
      return '半角整数、または、半角少数を入力してください。';
    }
  }
}
