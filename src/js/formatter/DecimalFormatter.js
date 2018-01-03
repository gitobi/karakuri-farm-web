import Formatter from './Formatter'

export default class DecimalFormatter extends Formatter {

  constructor() {
    super();
    this.placeholder = "0.0";
    this.patterns = [
      /^\d*(\.\d*)?$/,
    ];
  }

  getMessageOnCheckFormatError() {
    return '半角整数、または、半角少数を入力してください。';
  }
}
