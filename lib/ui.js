var $ = require('jquery');
var remote = require('remote');
var dialog = remote.require('dialog');
var BrowserWindow = remote.require('browser-window');
var ui = {};


$(document).ready(function () {
  var selection = new BrowserWindow({
    x: 0, y: 0,
    width: screen.availWidth,
    height: screen.availHeight,
    transparent: true,
    frame: false,
    resizable: true,
    show: false
  });
  selection.loadUrl('file://' + __dirname + '/selection.html');
  selection.on('closed', function () {
    debugger;
  });

  var countdown = new BrowserWindow({
    fullscreen: false,
    transparent: true,
    frame: false,
    resizable: false,
    show: false
  });
  countdown.loadUrl('file://' + __dirname + '/countdown.html');

  ui.params = {
    filename: null
  };
  ui.buttons = {
    select_region: $('#select_region'),
    record: $('#record_start'),
    save_as: $('#save_as')
  };
  ui.containers = {
    feedback: $('#feedback'),
    preview: $('#preview')
  };
  ui.windows = {
    main: remote.getCurrentWindow(),
    selection: selection,
    countdown: countdown
  };
  ui.dialogs = {
    save: function () {
      dialog.showSaveDialog(
        ui.windows.main,
        {
          title: 'Save as..',
          defaultPath: ui.params.filename,
          filters: [
            { name: 'Gif', extensions: ['gif'] },
            { name: 'Video', extensions: ['mp4'] },
          ]
        }, function (file) {
          ui.params.filename = file;
        }
      );
    }
  };
});
