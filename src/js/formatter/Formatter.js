export default class Formatter {

  constructor() {
    this.placeholder = "-";
    this.error = null;
    this.completionPatterns = [];
    this.patterns = [];
  }

  /**
   * [onChange description]
   * @param  {[type]} originalValue [description]
   * @param  {[type]} newValue      [description]
   * @return {[type]} {
   *         originalValue: originalValue,
   *         newValue: newValue,
   *         value: 補完された値,
   *         error: フォーマットチェックok時は null 、エラー時は エラーメッセージ
   *         valid: フォーマットチェックok時は true 、エラー時は false
   *         }
   */
  onChange(originalValue, newValue) {
    // 入力補完
    let completed = this.inputCompletion(originalValue, newValue);
    let returnMap = {
      originalValue: originalValue,
      newValue: newValue,
      value: completed,
    };

    // フォーマットチェック
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

  /**
   * [onBlur description]
   * @param  {[type]} value [description]
   * @return {[type]} {
   *         value: value,
   *         error: フォーマットチェックok時は null 、エラー時は エラーメッセージ
   *         valid: フォーマットチェックok時は true 、エラー時は false
   *         }
   */
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

  /**
   * 入力補完を行う。
   * this.completionPatterns.before が originalValue にマッチし、かつ、
   * this.completionPatterns.after が newValue にマッチした場合、
   * this.completionPatterns.completion による補完が行われる。
   * @param  {[type]} originalValue [description]
   * @param  {[type]} newValue      [description]
   * @return {[type]} 補完された文字列
   */
  inputCompletion(originalValue, newValue) {
    let returnValue = newValue;
    for (let completionPattern of this.completionPatterns) {
      // 入力補完
      // console.log('p', this.patterns, pattern);
      if ((completionPattern.before === originalValue
        || (null !== completionPattern.before && completionPattern.before.test(originalValue)))
          && completionPattern.after.test(returnValue)) {
        returnValue = completionPattern.completion(originalValue, returnValue);
      }
    }
    return returnValue;
  }

  /**
   * フォーマットチェックを行う。
   * this.patterns のいずれかに value がマッチすればokとする。
   * @param  {[type]} value [description]
   * @return {[type]} okの場合 true 、ngの場合 this.getMessageOnCheckFormatError の返り値
   */
  checkFormat(value) {
    if (!value) {
      // 入力がない場合はokとする
      return true;
    }

    if (0 === this.patterns.length) {
      // フォーマットパターンが存在しない場合はokとする
      return true;
    }

    let valid = false;
    for (let pattern of this.patterns) {
      valid |= pattern.test(value);
    }

    if (valid) {
      // console.log('format ok');
      return true;
    } else {
      // console.log('format error');
      return this.getMessageOnCheckFormatError();
    }
  }

  getMessageOnCheckFormatError() {
    return null;
  }
}
