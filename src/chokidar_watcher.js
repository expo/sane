'use strict';

var chokidar = require('chokidar');
var path = require('path');
var events = require('events');

var common = require('./common');

var EventEmitter = events.EventEmitter;

/**
 * Constants
 */
var CHANGE_EVENT = common.CHANGE_EVENT;
var DELETE_EVENT = common.DELETE_EVENT;
var ADD_EVENT = common.ADD_EVENT;
var ALL_EVENT = common.ALL_EVENT;

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
  var opts = {
    // persistent: true, // ?
    alwaysStat: true,
    atomic: true,
    ignorePermissionsErrors: false,
  };

  // Ignore dot directories
  // TODO: Make this ignore dot directories but not dot files?
  if (!this.dot) {
    opts.ignored = /[\/\\]\./;
  }

  // TODO: Handle multiple globs
  var toWatch = path.join(this.root, this.globs[0] || '');

  this.isReady = false;

  this.watcher = chokidar.watch(toWatch, opts);

  this.watcher
    .on('add', this.emitEvent.bind(this, ADD_EVENT))
    .on('change', this.emitEvent.bind(this, CHANGE_EVENT))
    .on('unlink', this.emitEvent.bind(this, DELETE_EVENT))
    .on('addDir', this.emitEvent.bind(this, ADD_EVENT))
    .on('unlinkDir', this.emitEvent.bind(this, DELETE_EVENT))
    .on('error', function (err) {
      console.error('Error while watching with chokidar:',
        err, '\nRestarting watch...');
      self.init();
    })
    .on('ready', function () {
      // Initial scan complete; ready to report changes
      self.isReady = true;
      self.emit('ready');
    });

};

/**
 * Transform and emit an event comming from the poller.
 *
 * @param {EventEmitter} monitor
 * @public
 */

ChokidarWatcher.prototype.emitEvent = function(type, file, stat) {
  if (!this.isReady) {
    return;
  }

  // console.log('*emitEvent*', type, file, '' + stat);

  file = path.relative(this.root, file);

  if (type === DELETE_EVENT) {
    // Matching the non-polling API
    stat = null;
  }

  // Filter out these mysterious ADD_EVENT s
  if ((type === ADD_EVENT) && (!file)) {
    return;
  }

  this.emit(type, file, this.root, stat);
  this.emit(ALL_EVENT, type, file, this.root, stat);
};

/**
 * End watching.
 *
 * @public
 */

ChokidarWatcher.prototype.close = function(callback) {
  this.watcher.close();
  delete this.watcher;
  this.removeAllListeners();
  if (typeof callback === 'function') {
    setImmediate(callback.bind(null, null, true));
  }
};
