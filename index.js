'use strict';

var ChokidarWatcher = require('./src/chokidar_watcher');
var NodeWatcher = require('./src/node_watcher');
var PollWatcher = require('./src/poll_watcher');
var WatchmanWatcher = require('./src/watchman_watcher');

function sane(dir, options) {
  if (options.poll) {
    return new PollWatcher(dir, options);
  } else if (options.watchman) {
    return new WatchmanWatcher(dir, options);
  } else if (options.chokidar) {
    return new ChokidarWatcher(dir, options);
  } else {
    return new NodeWatcher(dir, options);
  }
}

module.exports = sane;
sane.ChokidarWatcher = ChokidarWatcher;
sane.NodeWatcher = NodeWatcher;
sane.PollWatcher = PollWatcher;
sane.WatchmanWatcher = WatchmanWatcher;
