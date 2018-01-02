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
    let completed = this.inputCompletion(originalValue, newValue);
    let returnMap = {
      originalValue: originalValue,
      newValue: newValue,
      value: completed,
    };
    let checked = this.checkFormat(completed);
    if (checked === true) {
      returnMap.error = null;
      returnMap.valid = true;
    } else {
      returnMap.error = checked;
      returnMap.valid = false;
    }
    return returnMap;
  }

  onBlur(value) {
    let returnMap = {value: value};

    // フォーマットチェック
    let checked = this.checkFormat(value);
    if (checked === true) {
      returnMap.error = null;
      returnMap.valid = true;
    } else {
      returnMap.error = checked;
      returnMap.valid = false;
    }
    return returnMap;
  }

  inputCompletion(originalValue, newValue) {
    return newValue;
  }

  checkFormat(value) {
    return true;
  }
}
