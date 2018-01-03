import Formatter from './Formatter'

export default class DecimalFormatter extends Formatter {

  constructor(format) {
    super();
    this.placeholder = "00:00:00";

    this.completionPatterns = [
      {before: null,           after: /^\*$/,        completion: (bef, aft) => {return aft + '*:'}},
      {before: /(^$)/,         after: /^\*$/,        completion: (bef, aft) => {return aft + '*:'}},
      {before: /^.$/,          after: /^.\s$/,       completion: (bef, aft) => {return aft.replace(/^(.)\s$/, "$10:")}},
      {before: /^.$/,          after: /^..$/,        completion: (bef, aft) => {return aft + ':'}},
      {before: /^..:$/,        after: /^..:\*$/,     completion: (bef, aft) => {return aft + '*:'}},
      {before: /^..:.$/,       after: /^..:.\s$/,    completion: (bef, aft) => {return aft.replace(/^(..:)(.)\s$/, "$10$2:")}},
      {before: /^..:.$/,       after: /^..:..$/,     completion: (bef, aft) => {return aft + ':'}},
      {before: /^..:..:$/,     after: /^..:..:\*$/,  completion: (bef, aft) => {return aft + '*'}},
      {before: /^..:..:.$/,    after: /^..:..:.\s$/, completion: (bef, aft) => {return aft.replace(/^(..:..:)(.)\s$/, "$10$2")}},
      {before: /^\*\*$/,       after: /^\*$/,        completion: (bef, aft) => {return aft.substr(0, aft.length -1)}},
      {before: /^..:\*\*$/,    after: /^..:\*$/,     completion: (bef, aft) => {return aft.substr(0, aft.length -1)}},
      {before: /^..:..:\*\*$/, after: /^..:..:\*$/,  completion: (bef, aft) => {return aft.substr(0, aft.length -1)}},
    ];

    this.patterns = [
      /^\d\d:\*\*:\*\*$/,
      /^\*\*:\d\d:\*\*$/,
      /^\*\*:\*\*:\d\d$/,
      /^\d\d:\d\d:\d\d$/,
    ];
  }

  getMessageOnCheckFormatError() {
    return ['以下の形式で入力してください。',
      ' 毎日１２時を指定する場合: 12:**:**',
      ' 毎時３０分を指定する場合: **:30:**',
      ' 毎日１２時３０分００秒を指定する場合: 12:30:00'];
  }

}
