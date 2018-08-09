import Logger from './Logger'
import csv from 'csv'


export default class CsvConverter {
  constructor() {
    this.logger = new Logger({prefix: this.constructor.name});
  }

  /**
   * @param {object} options
   * @param {number} options.seed
   * @param {number} options.columns
   * @param {number} options.length
   */
  generate(options) {
    return new Promise((resolve, reject) => {
      csv.generate(options, (error, output) => {
        if (error) {
          reject(error);
        } else {
          resolve(output);
        }
      });
    });
  }

  /**
   *
   * @param {string} input
   * @param {object} options
   */
  parse(input, options) {
    return new Promise((resolve, reject) => {
      csv.parse(input, options, (error, output) => {
        if (error) {
          reject(error);
        } else {
          resolve(output);
        }
      });
    });
  }

  /**
   *
   * @param {string[][]} data
   * @param {function} handler
   * @param {object} [options]
   */
  transform(data, handler, options) {
    return new Promise((resolve, reject) => {
      if (options) {
        csv.transform(data, handler, options, (error, data) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        });
      } else {
        csv.transform(data, handler, (error, data) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        });
      }
    });
  }

  /**
   *
   * @param {string[][]} data
   * @param {object} options
   */
  stringify(data, options) {
    return new Promise((resolve, reject) => {
      if (options) {
        csv.stringify(data, options, (error, output) => {
          if (error) {
            reject(error);
          } else {
            resolve(output);
          }
        });
      } else {
        csv.stringify(data, (error, output) => {
          if (error) {
            reject(error);
          } else {
            resolve(output);
          }
        });
      }
    });
  }

}

