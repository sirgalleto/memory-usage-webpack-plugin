const colors = require('colors');
const heapdump = require('heapdump');

const TEN_SECONDS_IN_MS = 10000

const defaultConfig = {
  threshold: 1024,
  tresholdIncrease: 100,
  snaptshotOnKill: true,
  snaptshotOnSignal: true
}

/**
 * @param {!Object} config
 * @param {number} [config.threshold = 1024] - memory in mb when to save the first heapsnaptshot
 * @param {number} [config.tresholdIncrease = 100] -  memory in mb to increase threshold after a threshold is reached
 * @param {boolean} [config.snaptshotOnKill = true] - logs a heapsnaptshot when a kill -9 kills the process
 * @param {boolean} [config.snaptshotOnSignal = true] - logs a heapsnaptshot when a kill -USR2 kills the process
 * @class
 * @classdesc Logs a heapsnapshot of a webpack compilation.
 */
class MemoryUsageWebpackPlugin {
  constructor({
    threshold = defaultConfig.threshold,
    tresholdIncrease = defaultConfig.tresholdIncrease,
    snaptshotOnKill = defaultConfig.snaptshotOnKill,
    snaptshotOnSignal = defaultConfig.snaptshotOnSignal,
  } = defaultConfig) {

    this._treshold = threshold
    this._tresholdIncrease = tresholdIncrease
    this._snaptshotOnKill = snaptshotOnKill
    this._snaptshotOnSignal = snaptshotOnSignal

    this._intervalId = undefined
    this._timeoutId = undefined
  }

  _logMemoryUssage() {
    const { rss } = process.memoryUsage()
    const cwd = process.cwd()
    const now = Date.now()

    const rssInMB = rss / 1048576
    const fileName = `${cwd}/${now}.heapsnapshot`

    console.warn(
      `RSS Memory: ${rssInMB} MB`.yellow
    )

    this._stop()

    heapdump.writeSnapshot(fileName, (err, fileName) => {
      console.info(
        `Memory snaptshot stored in ${fileName}`.yellow
      )

      this._timeoutId = setTimeout(() => {
        this._start()
      }, TEN_SECONDS_IN_MS)
    });
  }

  _checkMemory() {
    const { rss } = process.memoryUsage()
    const rssInMB = rss / 1048576

    if (rss >= this._treshold) {
      this._logMemoryUssage()

      this._treshold += this._tresholdIncrease
    }
  }

  _start() {
    this._checkMemory()

    this._intervalId = setInterval(() => {
      this._checkMemory()
    }, TEN_SECONDS_IN_MS);
  }

  _stop() {
    clearInterval(this._intervalId);
    clearInterval(this._timeoutId);
  }

  apply(compiler) {
    compiler.hooks.run.tap(
      'MemoryUsageWebpackPlugin',
      () => {
        this._start()
      }
    )

    compiler.hooks.done.tap(
      'MemoryUsageWebpackPlugin',
      () => {
        this._stop()
      }
    )
  }
}

module.exports = MemoryUsageWebpackPlugin