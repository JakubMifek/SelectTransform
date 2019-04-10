"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StError = function (_Error) {
    _inherits(StError, _Error);

    /**
     * Creates an error using the given message.
     *
     * @param {string} message Message of the error
     */
    function StError(message) {
        _classCallCheck(this, StError);

        return _possibleConstructorReturn(this, (StError.__proto__ || Object.getPrototypeOf(StError)).call(this, message));
    }

    return StError;
}(Error);

var StErrors = exports.StErrors = {
    format: new StError("Wrong format of input template"),
    fillout: new StError("Expression contained unresolvable expressions")
};

/**
 * Provides methods that help with evaluation but do not fit into ST itself.
 */

var Helper = exports.Helper = function () {
    function Helper() {
        _classCallCheck(this, Helper);
    }

    _createClass(Helper, null, [{
        key: "is_template",

        /**
         * Checks whether the given string is a template ( {{ expression }} ).
         *
         * @param {string} str String to check
         */
        value: function is_template(str) {
            var re = /\{\{(.+)\}\}/g;
            return re.test(str);
        }
        /**
         * Checks whether the given object is an array.
         *
         * @param {object} item Object to check
         */

    }, {
        key: "is_array",
        value: function is_array(item) {
            return Array.isArray(item) || !!item && (typeof item === "undefined" ? "undefined" : _typeof(item)) === "object" && typeof item.length === "number" && (item.length === 0 || item.length > 0 && item.length - 1 in item);
        }
        /**
         * Takes any object, finds subtree based on given path and sets the object's value to new_val. The object is returned.
         *
         * @param {object} o
         * @param {string} path
         * @param {any} new_val
         */

    }, {
        key: "resolve",
        value: function resolve(o, path, new_val) {
            if (path && path.length > 0) {
                var func = Function("new_val", "with(this) {this" + path + "=new_val; return this;}").bind(o);
                return func(new_val);
            } else {
                o = new_val;
                return o;
            }
        }
        /**
         * Accepts the given string and transforms it into function name and expression.
         * Output: { name: FUNCTION_NAME:STRING, expression: FUNCTION_EXPRESSION:STRING }
         *
         * @param {string} str String to tokenize.
         */

    }, {
        key: "tokenize",
        value: function tokenize(str) {
            var re = /\{\{(.+)\}\}/g;
            str = str.replace(re, "$1");
            // str : '#each $jason.items'
            var tokens = str.trim().split(" ");
            // => tokens: ['#each', '$jason.items']
            var func = void 0;
            if (tokens.length > 0) {
                if (tokens[0][0] !== "#") throw StErrors.format;
                func = tokens.shift();
                // => func: '#each' or '#if'
                // => tokens: ['$jason.items', '&&', '$jason.items.length', '>', '0']
                var expression = tokens.join(" ");
                // => expression: '$jason.items && $jason.items.length > 0'
                return { name: func, expression: expression };
            }
            throw StErrors.format;
        }

        /**
         * Fills the given template using provided data.
         * 'raw' is true only for when this is called from #each
         * Because #each is expecting an array, it shouldn't be stringified.
         * Therefore we pass template:null, which will result in returning the original result instead of trying to replace it into the template with a stringified version
         *
         * @param {string} template Template used for fillout
         * @param {object} data Data used for fillout
         * @param {boolean} raw Denotes whether we are working with array or string
         */

    }, {
        key: "fillout",
        value: function fillout(template, data, raw) {
            // 1. fill out if possible
            // 2. otherwise return the original
            // Run fillout() only if it's a template. Otherwise just return the original string
            if (!Helper.is_template(template)) return template;
            var re = /\{\{(.*?)\}\}/g;
            // variables are all instances of {{ }} in the current expression
            // for example '{{this.item}} is {{this.user}}'s' has two variables: ['this.item', 'this.user']
            var variables = template.match(re);
            if (!variables) return template;
            if (raw) return Helper._fillout(null, variables[0], data);
            // Fill out the template for each variable
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = variables[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var variable = _step.value;

                    template = Helper._fillout(template, variable, data);
                }
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

            return template;
        }
    }, {
        key: "_fillout",
        value: function _fillout(template, variable, data) {
            // Given a template and fill it out with passed slot and its corresponding data
            var re = /\{\{(.*?)\}\}/g;
            var full_re = /^\{\{((?!\}\}).)*\}\}$/;
            try {
                // 1. Evaluate the variable
                var slot = variable.replace(re, "$1");
                // data must exist. Otherwise replace with blank
                if (data) {
                    var func = void 0;
                    // TODO: Do we need this?
                    // // Attach $root to each node so that we can reference it from anywhere
                    // const dataType = typeof data;
                    // if (['number', 'string', 'array', 'boolean', 'function'].indexOf(dataType === -1)) {
                    //     data.$root = root;
                    // }
                    // If the pattern ends with a return statement, but is NOT wrapped inside another function ([^}]*$), it's a function expression
                    var match = /function\([ ]*\)[ ]*\{(.*)\}[ ]*$/g.exec(slot);
                    if (match) {
                        func = Function("with(this) {" + match[1] + "}").bind(data);
                    } else if (/\breturn [^;]+;?[ ]*$/.test(slot) && /return[^}]*$/.test(slot)) {
                        // Function expression with explicit 'return' expression
                        func = Function("with(this) {" + slot + "}").bind(data);
                    } else {
                        // Function expression with explicit 'return' expression
                        // Ordinary simple expression that
                        func = Function("with(this) {return (" + slot + ")}").bind(data);
                    }
                    var evaluated = func();

                    // TODO: Do we need to do this?
                    // delete data.$root; // remove $root now that the parsing is over

                    if (evaluated) {
                        // In case of primitive types such as String, need to call valueOf() to get the actual value instead of the promoted object
                        evaluated = evaluated.valueOf();
                    }
                    if (typeof evaluated === "undefined")
                        // it tried to evaluate since the variable existed, but ended up evaluating to undefined
                        // (example: var a = [1,2,3,4]; var b = a[5];)
                        return template;
                    // 2. Fill out the template with the evaluated value
                    // Be forgiving and print any type, even functions, so it's easier to debug
                    if (evaluated) {
                        // IDEAL CASE : Return the replaced template
                        if (!template) return evaluated;
                        // if the template is a pure template with no additional static text,
                        // And if the evaluated value is an object or an array, we return the object itself instead of
                        // replacing it into template via string replace, since that will turn it into a string.
                        if (full_re.test(template)) return evaluated;
                        return template.replace(variable, evaluated);
                    }
                    // Treat false or null as blanks (so that #if can handle it)
                    if (!template) return "";
                    // if the template is a pure template with no additional static text,
                    // And if the evaluated value is an object or an array, we return the object itself instead of
                    // replacing it into template via string replace, since that will turn it into a string.
                    if (full_re.test(template)) return evaluated;
                    return template.replace(variable, "");
                }
                // REST OF THE CASES
                // if evaluated is null or undefined,
                // it probably means one of the following:
                //  1. The current data being parsed is not for the current template
                //  2. It's an error
                //
                //  In either case we need to return the original template unparsed.
                //    1. for case1, we need to leave the template alone so that the template can be parsed
                //      by another data set
                //    2. for case2, it's better to just return the template so it's easier to debug
                return template;
            } catch (err) {
                throw StErrors.fillout;
            }
        }
    }]);

    return Helper;
}();