"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Conditional = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Common = require("../Common");

var _st = require("../st");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _instance;

var Conditional = exports.Conditional = function () {
    function Conditional(st) {
        _classCallCheck(this, Conditional);

        this.st = st;
    }

    /**
     * Check given parameter whether it is an array of conditionals.
     *
     * @param {any} template Template to check
     */


    _createClass(Conditional, [{
        key: "fits",
        value: function fits(template) {
            // TRUE ONLY IF it's in a correct format.
            // Otherwise return the original template
            // Condition 0. Must be an array
            // Condition 1. Must have at least one item
            // Condition 2. Each item in the array should be an object of a single key/value pair
            // Condition 3. starts with #if
            // Condition 4. in case there's more than two items, everything between the first and the last item should be #elseif
            // Condition 5. in case there's more than two items, the last one should be either '#else' or '#elseif'
            // Condition 0, it needs to be an array to be a conditional
            if (!_Common.Helper.is_array(template)) {
                return false;
            }
            // Condition 1, must have at least one item
            if (template.length === 0) {
                return false;
            }
            // Condition 2, each item in the array should be an object, and  of a single key/value pair
            for (var i = 0; i < template.length; i++) {
                var item = template[i];
                if ((typeof item === "undefined" ? "undefined" : _typeof(item)) !== "object") return false;
                // an item in the array has multiple key value pairs, so invalid.
                if (Object.keys(item).length !== 1) return false;
            }
            // Condition 3, the first item should have #if as its key; the first item should also contain an expression
            var first = template[0];
            var func = void 0;
            for (var key in first) {
                func = _Common.Helper.tokenize(key);
                if (!func || !func.name || !func.expression || func.expression.length === 0 || func.name.toLowerCase() !== "#if") return false;
            }
            if (template.length === 1) {
                // If we got this far and the template has only one item, it means template had one item which was '#if' so it's valid
                return true;
            }
            // Condition 4, in case there's more than two items, everything between the first and the last item should be #elseif
            for (var templateIndex = 1; templateIndex < template.length - 1; templateIndex++) {
                var templateItem = template[templateIndex];
                for (var templateKey in templateItem) {
                    func = _Common.Helper.tokenize(templateKey);
                    if (func.name.toLowerCase() !== "#elseif") {
                        return false;
                    }
                }
            }
            // If you've reached this point, it means we have multiple items and everything between the first and the last item are elseifs.
            // Now we need to check the validity of the last item
            // Condition 5, in case there's more than one item, it should end with #else or #elseif
            var last = template[template.length - 1];
            for (var last_key in last) {
                func = _Common.Helper.tokenize(last_key);
                if (["#else", "#elseif"].indexOf(func.name.toLowerCase()) === -1) return false;
            }
            // Congrats, if you've reached this point, it's valid
            return true;
        }

        /**
         * Transforms the data using provided template.
         *
         * @param {Array} template
         * @param {object} data
         * @param {Transform} Transformer
         */

    }, {
        key: "execute",
        value: function execute(template, data, ts) {
            // expecting template as an array of objects,
            // each of which contains '#if', '#elseif', 'else' as key
            // item should be in the format of:
            // {'#if item': 'blahblah'}
            // Step 1. get all the conditional keys of the template first.
            // Step 2. then try evaluating one by one until something returns true
            // Step 3. if it reaches the end, the last item shall be returned
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = template[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var item = _step.value;

                    // assuming that there's only a single kv pair for each item
                    var key = Object.keys(item)[0];
                    var func = _Common.Helper.tokenize(key);
                    if (func.name === "#if" || func.name === "#elseif") {
                        var expression = func.expression;
                        var res = _Common.Helper.fillout("{{" + expression + "}}", data);
                        if (res === "{{" + expression + "}}")
                            // if there was at least one item that was not evaluatable,
                            // we halt parsing and throw an error;
                            throw _Common.StErrors.fillout;
                        if (res)
                            // run the current one and return
                            return ts.run(item[key], data);
                        // res was falsy. Ignore this branch and go on to the next item
                        continue;
                    }
                    // #else
                    // if you reached this point, it means:
                    //  1. there were no non-evaluatable expressions
                    //  2. Yet all preceding expressions evaluated to falsy value
                    //  Therefore we run this branch
                    return ts.run(item[key], data);
                }
                // if you've reached this point, it means nothing matched.
                // so return null
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return null;
        }
    }], [{
        key: "getInstance",
        value: function getInstance() {
            return _instance;
        }
    }]);

    return Conditional;
}();

_instance = new Conditional();