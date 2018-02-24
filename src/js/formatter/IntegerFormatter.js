import Formatter from './Formatter'

export default class IntegerFormatter extends Formatter {

  constructor() {
    super();
    this.placeholder = "0";
    this.patterns = [
      /^\d*$/,
    ];
  }

  getMessageOnCheckFormatError() {
    return '半角整数を入力してください。';
  }
}
