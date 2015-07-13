var $ = require('jquery');
var ui = {};
$(document).ready(function () {
  ui.buttons = {
    select_region: $('#select_region'),
    record: $('#record_start'),
    save_as: $('#save_as')
  };
  ui.containers = {
    feedback: $('#feedback'),
    preview: $('#preview')
  };
});
