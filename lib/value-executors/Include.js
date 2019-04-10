"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Include = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Common = require("../Common");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _instance;

var Include = exports.Include = function () {
  function Include() {
    _classCallCheck(this, Include);
  }

  _createClass(Include, [{
    key: "fits",
    value: function fits(template) {
      return typeof template === "string" && /\{\{([ ]*#include)[ ]*([^ ]*)\}\}/g.test(template);
    }
  }, {
    key: "execute",
    value: function execute(template, data, ts) {
      var fun = _Common.Helper.tokenize(template);
      if (fun.expression)
        // if #include has arguments, evaluate it before attaching
        return _Common.Helper.fillout("{{" + fun.expression + "}", data, true);

      // shouldn't happen =>
      // {'wrapper': '{{#include}}'}
      return template;
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      return _instance;
    }
  }]);

  return Include;
}();

_instance = new Include();