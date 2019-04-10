"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.executors = undefined;

var _Template = require("./Template");

var _Include = require("./Include");

/**
 * Array of executors for values in templates.
 */
var executors = exports.executors = [_Template.Template, _Include.Include];