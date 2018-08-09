import Logger from './Logger'
import downloadjs from 'downloadjs'


export default class Downloader {
  constructor() {
    this.logger = new Logger({prefix: this.constructor.name});
  }

  download(data, filename) {
    downloadjs(data, filename);
  }

}

