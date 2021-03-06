export default class Logger {

  constructor(params={}) {
    if (params.prefix) {
      this.prefix = params.prefix + ' @';
    }

    if (window.console && console && console.log && console.log.bind) {
      this.log     = console.log.bind(console, this.prefix);
      this.error   = console.error.bind(console, this.prefix);
      this.dir     = console.dir.bind(console, this.prefix);
      this.warn    = console.warn.bind(console, this.prefix);
      this.info    = console.info.bind(console, this.prefix);
      this.trace   = console.trace.bind(console, this.prefix);

      this.time    = console.time.bind(console, this.prefix);
      this.timeEnd = console.timeEnd.bind(console, this.prefix);

    } else {
      this.log     = function() {};
      this.error   = function() {};
      this.dir     = function() {};
      this.warn    = function() {};
      this.info    = function() {};
      this.trace    = function() {};

      this.time    = function() {};
      this.timeEnd = function() {};
    }
  }
}
