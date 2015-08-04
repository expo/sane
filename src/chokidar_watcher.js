'use strict';

var chokidar = require('chokidar');
var path = require('path');

var common = require('./common');

/**
 * Constants
 */
var CHANGE_EVENT = common.CHANGE_EVENT;
var DELETE_EVENT = common.DELETE_EVENT;
var ADD_EVENT = common.ADD_EVENT;
var ALL_EVENT = common.ALL_EVENT;
var SUB_NAME = 'sane-sub';

/**
 * Export `ChokidarWatcher` class.
 */

module.exports = ChokidarWatcher;

/**
 * Watches `dir`.
 *
 * @class ChokidarWatcher
 * @param String dirt
 * @param {Object} opts
 * @public
 */

function ChokidarWatcher(dir, opts) {
  opts = common.assignOptions(this, opts);
  this.root = path.resolve(dir);
  this.init();
}

ChokidarWatcher.prototype.__proto__ = EventEmitter.prototype;

/**
 * Subscribe to changes
 *
 * @private
 */
ChokidarWatcher.prototype.init = function () {

  if (this.watcher) {
    this.watcher.close();
  }

  var self = this;
  this.watcher = chokidar.watch('

  if (this.client) {
    this.client.removeAllListeners();
  }

  var self = this;
  var

}
