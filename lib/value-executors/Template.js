"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Template = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Common = require("../Common");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _instance;

var Template = exports.Template = function () {
  function Template() {
    _classCallCheck(this, Template);
  }

  _createClass(Template, [{
    key: "fits",
    value: function fits(template) {
      return typeof template === "string" && /^\s*\{\{\s*#template\s+[^\s]+\s*\}\}\s*$/g.test(template);
    }
  }, {
    key: "execute",
    value: function execute(template, data, ts) {
      var fun = _Common.Helper.tokenize(template);
      // insert one of stored templates
      var ptemplate = ts.st.templates[fun.expression];
      return ts.run(ptemplate, data);
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      return _instance;
    }
  }]);

  return Template;
}();

_instance = new Template();