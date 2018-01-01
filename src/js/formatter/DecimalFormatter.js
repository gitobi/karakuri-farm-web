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

  onChange(originalValue, newValue) {
    // console.log('originalValue:', originalValue, 'newValue:', newValue)
    if (!newValue) {
      return newValue;
    }

    let pattern = /^\d*(\.\d*)?$/;
    if (pattern.test(newValue)) {
      // console.log('format ok');
      this.error = null;
      return newValue;
    } else {
      // console.log('format error');
      this.error = '半角整数、または、半角少数を入力してください。'
      return originalValue;
    }
  }

  onBlur(originalValue, newValue) {
    return newValue;
  }


}
