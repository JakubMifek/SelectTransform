(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const d = require('./dist');
var ST = new d.SelectTransform();
Object.assign($context, { ST });

},{"./dist":6}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;

},{}],3:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Conditional = void 0;
var internal_1 = require("../internal");
var Conditional = /** @class */ (function () {
    function Conditional() {
        this.name = Conditional.name;
    }
    Conditional.prototype.getName = function () {
        return this.name;
    };
    /**
     * Check given parameter whether it is an array of conditionals.
     *
     * @param {Array<any>} template Template to check
     */
    Conditional.prototype.fits = function (template) {
        // TRUE ONLY IF it's in a correct format.
        // Otherwise return the original template
        // Condition 0. Must be an array
        // Condition 1. Must have at least one item
        // Condition 2. Each item in the array should be an object of a single
        // key/value pair
        // Condition 3. starts with #if
        // Condition 4. in case there's more than two items, everything between the
        // first and the last item should be #elseif
        // Condition 5. in case there's more than two items, the last one should be
        // either '#else' or '#elseif'
        // Condition 0, it needs to be an array to be a conditional
        if (!internal_1.Helper.isArray(template)) {
            return false;
        }
        // Condition 1, must have at least one item
        if (template.length === 0) {
            return false;
        }
        // Condition 2, each item in the array should be an object, and  of a single key/value pair
        for (var i = 0; i < template.length; i++) {
            var item = template[i];
            if (typeof item !== 'object')
                return false;
            // an item in the array has multiple key value pairs, so invalid.
            if (Object.keys(item).length !== 1)
                return false;
        }
        // Condition 3, the first item should have #if as its key; the first item
        // should also contain an expression
        var first = template[0];
        var func;
        for (var key in first) {
            if (typeof first[key] === 'function')
                continue;
            if (!internal_1.Helper.isFunction(key))
                return false;
            func = internal_1.Helper.tokenize(key);
            if (!func ||
                !func.name ||
                !func.expression ||
                func.expression.length === 0 ||
                func.name.toLowerCase() !== '#if') {
                return false;
            }
        }
        if (template.length === 1) {
            // If we got this far and the template has only one item, it means
            // template had one item which was '#if' so it's valid
            return true;
        }
        // Condition 4, in case there's more than two items, everything between the
        // first and the last item should be #elseif
        for (var templateIndex = 1; templateIndex < template.length - 1; templateIndex++) {
            var templateItem = template[templateIndex];
            // tslint:disable-next-line: forin
            for (var templateKey in templateItem) {
                if (!internal_1.Helper.isFunction(templateKey))
                    return false;
                func = internal_1.Helper.tokenize(templateKey);
                if (func.name.toLowerCase() !== '#elseif') {
                    return false;
                }
            }
        }
        // If you've reached this point, it means we have multiple items and
        // everything between the first and the last item are elseifs.
        // Now we need to check the validity of the last item
        // Condition 5, in case there's more than one item, it should end with #else or #elseif
        var last = template[template.length - 1];
        for (var lastKey in last) {
            if (typeof last[lastKey] === 'function')
                continue;
            if (!internal_1.Helper.isFunction(lastKey))
                return false;
            func = internal_1.Helper.tokenize(lastKey);
            if (['#else', '#elseif'].indexOf(func.name.toLowerCase()) === -1) {
                return false;
            }
        }
        // Valid
        return true;
    };
    /**
     * Transforms the data using provided template.
     *
     * @param {Array<any>} template
     * @param {object} data
     * @param {Transform} Transformer
     */
    Conditional.prototype.executeSync = function (template, data, ts) {
        // expecting template as an array of objects,
        // each of which contains '#if', '#elseif', 'else' as key
        // item should be in the format of:
        // {'#if item': 'blahblah'}
        // Step 1. get all the conditional keys of the template first.
        // Step 2. then try evaluating one by one until something returns true
        // Step 3. if it reaches the end, the last item shall be returned
        for (var _i = 0, template_1 = template; _i < template_1.length; _i++) {
            var item = template_1[_i];
            // assuming that there's only a single kv pair for each item
            var key = Object.keys(item)[0];
            var func = internal_1.Helper.tokenize(key);
            if (func.name === '#if' || func.name === '#elseif') {
                var expression = func.expression;
                var res = internal_1.Helper.fillout("{{" + expression + "}}", data, false);
                if (res === "{{" + expression + "}}") {
                    // if there was at least one item that was not evaluatable,
                    // we halt parsing and throw an error;
                    throw internal_1.ST_ERRORS.fillout;
                }
                if (res) {
                    // run the current one and return
                    return ts.runSync(item[key], data);
                }
                // res was falsy. Ignore this branch and go on to the next item
                continue;
            }
            // #else
            // if you reached this point, it means:
            //  1. there were no non-evaluatable expressions
            //  2. Yet all preceding expressions evaluated to falsy value
            //  Therefore we run this branch
            return ts.runSync(item[key], data);
        }
        // if you've reached this point, it means nothing matched.
        // so return null
        return null;
    };
    /**
     * Transforms the data using provided template.
     *
     * @param {Array<any>} template
     * @param {object} data
     * @param {Transform} Transformer
     */
    Conditional.prototype.execute = function (template, data, ts) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, template_2, item, key, func, expression, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, template_2 = template;
                        _a.label = 1;
                    case 1:
                        if (!(_i < template_2.length)) return [3 /*break*/, 7];
                        item = template_2[_i];
                        key = Object.keys(item)[0];
                        func = internal_1.Helper.tokenize(key);
                        if (!(func.name === '#if' || func.name === '#elseif')) return [3 /*break*/, 4];
                        expression = func.expression;
                        res = internal_1.Helper.fillout("{{" + expression + "}}", data, false);
                        if (res === "{{" + expression + "}}") {
                            // if there was at least one item that was not evaluatable,
                            // we halt parsing and throw an error;
                            throw internal_1.ST_ERRORS.fillout;
                        }
                        if (!res) return [3 /*break*/, 3];
                        return [4 /*yield*/, ts.run(item[key], data)];
                    case 2: 
                    // run the current one and return
                    return [2 /*return*/, _a.sent()];
                    case 3: 
                    // res was falsy. Ignore this branch and go on to the next item
                    return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, ts.run(item[key], data)];
                    case 5: 
                    // #else
                    // if you reached this point, it means:
                    //  1. there were no non-evaluatable expressions
                    //  2. Yet all preceding expressions evaluated to falsy value
                    //  Therefore we run this branch
                    return [2 /*return*/, _a.sent()];
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7: 
                    // if you've reached this point, it means nothing matched.
                    // so return null
                    return [2 /*return*/, null];
                }
            });
        });
    };
    return Conditional;
}());
exports.Conditional = Conditional;

},{"../internal":7}],4:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
exports.executors = void 0;
__exportStar(require("./array-executor"), exports);
var conditional_1 = require("./conditional");
/**
 * Array of executors for arrays in templates.
 */
exports.executors = [new conditional_1.Conditional()];

},{"./array-executor":2,"./conditional":3}],5:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Helper = exports.ST_ERRORS = void 0;
var StError = /** @class */ (function (_super) {
    __extends(StError, _super);
    /**
     * Creates an error using the given message.
     *
     * @param {string} message Message of the error
     */
    function StError(message) {
        return _super.call(this, message) || this;
    }
    return StError;
}(Error));
exports.ST_ERRORS = {
    format: new StError('Wrong format of input template'),
    fillout: new StError('Expression contained unresolvable expressions'),
    data: new StError('Wrong data in the context')
};
/**
 * Provides methods that help with evaluation but do not fit into ST itself.
 */
var Helper = /** @class */ (function () {
    function Helper() {
    }
    /**
     * Checks whether the given string is a function ( {{ #name expression? }} ).
     *
     * @param {string} str String to check
     */
    Helper.isFunction = function (str) {
        var re = /\{\{\s*#([^\s]+)(\s+([^\s]+))*\s*\}\}/g;
        return re.test(str);
    };
    /**
     * Checks whether the given string is a template ( {{ expression }} ).
     *
     * @param {string} str String to check
     */
    Helper.isTemplate = function (str) {
        var re = /\{\{(.+)\}\}/g;
        return re.test(str);
    };
    /**
     * Checks whether the given object is an array.
     *
     * @param {object} item Object to check
     */
    Helper.isArray = function (item) {
        return (Array.isArray(item) ||
            (!!item &&
                typeof item === 'object' &&
                typeof item.length === 'number' &&
                (item.length === 0 ||
                    (item.length > 0 &&
                        item.length - 1 in item))));
    };
    /**
     * Takes any object, finds subtree based on given path and sets the object's
     * value to new_val. The object is returned.
     *
     * @param {DataObject} o
     * @param {string} path
     * @param {any} newVal
     */
    Helper.resolve = function (o, path, newVal) {
        if (path && path.length > 0) {
            var func = Function('new_val', "with(this) {this" + path + "=new_val; return this;}").bind(o);
            return func(newVal);
        }
        o = newVal;
        return o;
    };
    /**
     * Accepts the given string and transforms it into function name and expression.
     * Output: { name: FUNCTION_NAME:STRING, expression: FUNCTION_EXPRESSION:STRING }
     *
     * @param {string} str String to tokenize.
     */
    Helper.tokenize = function (str) {
        var re = /\{\{(.+)\}\}/g;
        str = str.replace(re, '$1');
        // str : '#each $jason.items'
        var tokens = str.trim().split(' ');
        // => tokens: ['#each', '$jason.items']
        var func;
        if (tokens.length > 0) {
            if (tokens[0][0] !== '#') {
                var error = exports.ST_ERRORS.format;
                error.message += ' - Does not start with "#".';
                throw error;
            }
            func = tokens.shift();
            // => func: '#each' or '#if'
            // => tokens: ['$jason.items', '&&', '$jason.items.length', '>', '0']
            var expression = tokens.join(' ');
            // => expression: '$jason.items && $jason.items.length > 0'
            return { name: func, expression: expression };
        }
        var err = exports.ST_ERRORS.format;
        err.message += ' - No tokens.';
        throw err;
    };
    /**
     * Fills the given template using provided data.
     * 'raw' is true only for when this is called from #each
     * Because #each is expecting an array, it shouldn't be stringified.
     * Therefore we pass template:null, which will result in returning
     * the original result instead of trying to replace it into the template with
     * a stringified version
     *
     * @param {string} template Template used for fillout
     * @param {DataObject} data Data used for fillout
     * @param {boolean} raw Denotes whether we are working with array or string
     */
    Helper.fillout = function (template, data, raw, keepTemplate) {
        if (keepTemplate === void 0) { keepTemplate = false; }
        // 1. fill out if possible
        // 2. otherwise return the original
        // Run fillout() only if it's a template. Otherwise just return the original string
        if (!Helper.isTemplate(template))
            return template;
        var re = /\{\{(.*?)\}\}/g;
        // variables are all instances of {{ }} in the current expression
        // for example '{{this.item}} is {{this.user}}'s' has two variables: ['this.item', 'this.user']
        var variables = template.match(re);
        if (!variables)
            return template;
        if (raw)
            return Helper._fillout(null, variables[0], data, keepTemplate);
        // Fill out the template for each variable
        for (var _i = 0, variables_1 = variables; _i < variables_1.length; _i++) {
            var variable = variables_1[_i];
            template = Helper._fillout(template, variable, data, keepTemplate);
        }
        return template;
    };
    Helper._fillout = function (template, variable, data, keepTemplate) {
        if (keepTemplate === void 0) { keepTemplate = false; }
        // Given a template and fill it out with passed slot and its corresponding data
        var re = /\{\{(.*?)\}\}/g;
        var fullRe = /^\{\{((?!\}\}).)*\}\}$/;
        try {
            // 1. Evaluate the variable
            var slot = variable.replace(re, '$1');
            // data must exist. Otherwise replace with blank
            if (data) {
                var func = void 0;
                // TODO: Do we need this?
                // // Attach $root to each node so that we can reference it from anywhere
                // const dataType = typeof data;
                // if (['number', 'string', 'array', 'boolean', 'function'].indexOf(dataType === -1)) {
                //     data.$root = root;
                // }
                // If the pattern ends with a return statement, but is NOT wrapped
                // inside another function ([^}]*$), it's a function expression
                var match = /function\([ ]*\)[ ]*\{(.*)\}[ ]*$/g.exec(slot);
                if (match) {
                    func = Function("with(this) {" + match[1] + "}").bind(data);
                }
                else if (/\breturn [^;]+;?[ ]*$/.test(slot) &&
                    /return[^}]*$/.test(slot)) {
                    // Function expression with explicit 'return' expression
                    func = Function("with(this) {" + slot + "}").bind(data);
                }
                else {
                    // Function expression with explicit 'return' expression
                    // Ordinary simple expression that
                    func = Function("with(this) {return (" + slot + ")}").bind(data);
                }
                var evaluated = func();
                // TODO: Do we need to do this?
                // delete data.$root; // remove $root now that the parsing is over
                if (evaluated) {
                    // In case of primitive types such as String, need to call valueOf()
                    // to get the actual value instead of the promoted object
                    evaluated = evaluated.valueOf();
                }
                if (typeof evaluated === 'undefined') {
                    // it tried to evaluate since the variable existed, but ended up
                    // evaluating to undefined
                    // (example: var a = [1,2,3,4]; var b = a[5];)
                    return template;
                }
                // 2. Fill out the template with the evaluated value
                // Be forgiving and print any type, even functions, so it's easier to debug
                if (evaluated) {
                    // IDEAL CASE : Return the replaced template
                    if (!template)
                        return evaluated;
                    // if the template is a pure template with no additional static text,
                    // And if the evaluated value is an object or an array, we return the
                    // object itself instead of replacing it into template via string
                    // replace, since that will turn it into a string.
                    if (fullRe.test(template))
                        return evaluated;
                    return template.replace(variable, evaluated);
                }
                // Treat false or null as blanks (so that #if can handle it)
                if (!template)
                    return '';
                // if the template is a pure template with no additional static text,
                // And if the evaluated value is an object or an array, we return the
                // object itself instead of replacing it into template via string
                // replace, since that will turn it into a string.
                if (fullRe.test(template))
                    return evaluated;
                return template.replace(variable, '');
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
        }
        catch (err) {
            if (keepTemplate)
                return template;
            var e = exports.ST_ERRORS.fillout;
            e.message += " -- " + err.message;
            throw e;
        }
    };
    return Helper;
}());
exports.Helper = Helper;

},{}],6:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.SelectTransform = void 0;
var internal_1 = require("./internal");
__createBinding(exports, internal_1, "SelectTransform");

},{"./internal":7}],7:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
exports.valueExecutors = exports.keyExecutors = exports.arrayExecutors = void 0;
var ae = require("./array-executors");
var ke = require("./key-executors");
var ve = require("./value-executors");
exports.arrayExecutors = ae.executors;
exports.keyExecutors = ke.executors;
exports.valueExecutors = ve.executors;
__exportStar(require("./common"), exports);
__exportStar(require("./select"), exports);
__exportStar(require("./transform"), exports);
__exportStar(require("./st"), exports);

},{"./array-executors":4,"./common":5,"./key-executors":12,"./select":19,"./st":20,"./transform":21,"./value-executors":23}],8:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Concat = void 0;
var internal_1 = require("../internal");
var Concat = /** @class */ (function () {
    function Concat() {
        this.name = Concat.name;
    }
    Concat.prototype.getName = function () {
        return this.name;
    };
    Concat.prototype.fits = function (template) {
        return (typeof template === 'string' &&
            /^\s*\{\{\s*#concat\s*\}\}\s*$/g.test(template.toLowerCase()));
    };
    Concat.prototype.executeSync = function (template, data, ts, key, result) {
        if (!internal_1.Helper.isArray(template[key])) {
            var err = internal_1.ST_ERRORS.format;
            err.message += " - Wrong " + Concat.name + " format - expected an array as the value.";
            throw err;
        }
        result = [];
        for (var _i = 0, _a = template[key]; _i < _a.length; _i++) {
            var item = _a[_i];
            result = result.concat(ts.runSync(item, data));
        }
        return result;
    };
    Concat.prototype.execute = function (template, data, ts, key, result) {
        return __awaiter(this, void 0, void 0, function () {
            var err, promises, _i, _a, item;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!internal_1.Helper.isArray(template[key])) {
                            err = internal_1.ST_ERRORS.format;
                            err.message += " - Wrong " + Concat.name + " format - expected an array as the value.";
                            throw err;
                        }
                        promises = [];
                        for (_i = 0, _a = template[key]; _i < _a.length; _i++) {
                            item = _a[_i];
                            promises.push(ts.run(item, data));
                        }
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    return Concat;
}());
exports.Concat = Concat;

},{"../internal":7}],9:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Each = void 0;
var internal_1 = require("../internal");
var Each = /** @class */ (function () {
    function Each() {
        this.name = Each.name;
    }
    Each.prototype.getName = function () {
        return this.name;
    };
    Each.prototype.fits = function (template) {
        return (typeof template === 'string' &&
            /^\s*\{\{\s*#each\s+.+\s*\}\}\s*$/g.test(template.toLowerCase()));
    };
    Each.prototype.execute = function (template, data, ts, key, result) {
        return __awaiter(this, void 0, void 0, function () {
            var fun, dataArray, err, promises, d, _loop_1, index;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fun = internal_1.Helper.tokenize(key);
                        dataArray = internal_1.Helper.fillout('{{' + fun.expression + '}}', data, true);
                        // Ideally newData should be an array since it was prefixed by #each
                        if (!dataArray || !internal_1.Helper.isArray(dataArray)) {
                            err = internal_1.ST_ERRORS.data;
                            err.message += " - Wrong " + Each.name + " data - expected an array as the iterator.";
                            throw err;
                        }
                        promises = [];
                        d = JSON.parse(JSON.stringify(dataArray));
                        _loop_1 = function (index) {
                            var i = index;
                            promises.push(
                            // tslint:disable-next-line: ter-arrow-parens
                            new Promise(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                var t, k, loopItem, k;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            t = ts.copy();
                                            // temporarily set $index and $this
                                            if (typeof d[i] === 'object') {
                                                d[i]['$index'] = i;
                                                d[i]['$this'] = d[i];
                                                d[i]['$root'] = data['$root'];
                                                // Copy in the memory
                                                for (k in t.memory) {
                                                    // Only if we do not override anything
                                                    if (d[i][k] === undefined) {
                                                        d[i][k] = t.memory[k];
                                                    }
                                                }
                                            }
                                            return [4 /*yield*/, t.run(template[key], d[i])];
                                        case 1:
                                            loopItem = _a.sent();
                                            // clean up $index and $this
                                            if (typeof d[i] === 'object') {
                                                delete d[i]['$index'];
                                                delete d[i]['$this'];
                                                delete d[i]['$root'];
                                                // Copy in the memory
                                                // tslint:disable-next-line: forin
                                                for (k in t.memory) {
                                                    // Delete what we added
                                                    delete d[i][k];
                                                }
                                            }
                                            res(loopItem);
                                            return [2 /*return*/];
                                    }
                                });
                            }); }));
                        };
                        for (index = 0; index < dataArray.length; index++) {
                            _loop_1(index);
                        }
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Each.prototype.executeSync = function (template, data, ts, key, result) {
        var fun = internal_1.Helper.tokenize(key);
        // newData will be filled with parsed results
        var dataArray = internal_1.Helper.fillout('{{' + fun.expression + '}}', data, true);
        // Ideally newData should be an array since it was prefixed by #each
        if (!dataArray || !internal_1.Helper.isArray(dataArray)) {
            var err = internal_1.ST_ERRORS.data;
            err.message += " - Wrong " + Each.name + " data - expected an array as the iterator.";
            throw err;
        }
        result = [];
        for (var index = 0; index < dataArray.length; index++) {
            // temporarily set $index and $this
            if (typeof dataArray[index] === 'object') {
                dataArray[index]['$index'] = index;
                dataArray[index]['$this'] = dataArray[index];
                dataArray[index]['$root'] = data['$root'];
                // Copy in the memory
                for (var k in ts.memory) {
                    // Only if we do not override anything
                    if (dataArray[index][k] === undefined) {
                        dataArray[index][k] = ts.memory[k];
                    }
                }
            }
            else {
                String.prototype.$index = index;
                String.prototype.$this = dataArray[index];
                Number.prototype.$index = index;
                Number.prototype.$this = dataArray[index];
                Function.prototype.$index = index;
                Function.prototype.$this = dataArray[index];
                Array.prototype.$index = index;
                Array.prototype.$this = dataArray[index];
                Boolean.prototype.$index = index;
                Boolean.prototype.$this = dataArray[index];
            }
            // run
            var loopItem = ts.runSync(template[key], dataArray[index]);
            // clean up $index and $this
            if (typeof dataArray[index] === 'object') {
                delete dataArray[index]['$index'];
                delete dataArray[index]['$this'];
                delete dataArray[index]['$root'];
                // Copy in the memory
                // tslint:disable-next-line: forin
                for (var k in ts.memory) {
                    // Delete what we added
                    delete dataArray[index][k];
                }
            }
            else {
                delete String.prototype.$index;
                delete String.prototype.$this;
                delete Number.prototype.$index;
                delete Number.prototype.$this;
                delete Function.prototype.$index;
                delete Function.prototype.$this;
                delete Array.prototype.$index;
                delete Array.prototype.$this;
                delete Boolean.prototype.$index;
                delete Boolean.prototype.$this;
            }
            if (loopItem !== undefined && loopItem !== null) {
                // only push when the result is not null nor undefined
                // null could mean #if clauses where nothing matched => In this case
                // instead of rendering 'null', should just skip it completely
                result.push(loopItem);
            }
        }
        return result;
    };
    return Each;
}());
exports.Each = Each;

},{"../internal":7}],10:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Flatten = void 0;
var internal_1 = require("../internal");
var Flatten = /** @class */ (function () {
    function Flatten() {
        this.name = Flatten.name;
    }
    Flatten.prototype.getName = function () {
        return this.name;
    };
    Flatten.prototype.fits = function (template) {
        return (typeof template === 'string' &&
            /^\s*\{\{\s*#flatten\s*\}\}\s*$/g.test(template.toLowerCase()));
    };
    Flatten.prototype.executeSync = function (template, data, ts, key, result) {
        var obj = ts.runSync(template[key], data);
        result = [];
        if (internal_1.Helper.isArray(obj)) {
            var arr = obj;
            // For each item in the array
            for (var i = 0; i < arr.length; i++) {
                if (internal_1.Helper.isArray(arr[i])) {
                    // If array then flatten
                    for (var j = 0; j < arr[i].length; j++) {
                        result.push(arr[i][j]);
                    }
                }
                else {
                    // Just push if anything else
                    result.push(arr[i]);
                }
            }
        }
        return result;
    };
    Flatten.prototype.execute = function (template, data, ts, key, result) {
        return __awaiter(this, void 0, void 0, function () {
            var obj, arr, i, j;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ts.run(template[key], data)];
                    case 1:
                        obj = _a.sent();
                        result = [];
                        if (internal_1.Helper.isArray(obj)) {
                            arr = obj;
                            // For each item in the array
                            for (i = 0; i < arr.length; i++) {
                                if (internal_1.Helper.isArray(arr[i])) {
                                    // If array then flatten
                                    for (j = 0; j < arr[i].length; j++) {
                                        result.push(arr[i][j]);
                                    }
                                }
                                else {
                                    // Just push if anything else
                                    result.push(arr[i]);
                                }
                            }
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return Flatten;
}());
exports.Flatten = Flatten;

},{"../internal":7}],11:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.For = void 0;
var internal_1 = require("../internal");
var For = /** @class */ (function () {
    function For() {
        this.name = For.name;
    }
    For.prototype.getName = function () {
        return this.name;
    };
    For.prototype.fits = function (template) {
        return (typeof template === 'string' &&
            /^\s*\{\{\s*#for\s+.+\s*\}\}\s*$/g.test(template.toLowerCase()));
    };
    For.prototype.execute = function (template, data, ts, key, result) {
        return __awaiter(this, void 0, void 0, function () {
            var fun, dataArray, err, promises, d, _loop_1, k, _a, _b, _c, _d;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        fun = internal_1.Helper.tokenize(key);
                        dataArray = internal_1.Helper.fillout('{{' + fun.expression + '}}', data, true);
                        // Ideally newData should be an array since it was prefixed by #each
                        if (!dataArray) {
                            err = internal_1.ST_ERRORS.data;
                            err.message += " - Wrong " + For.name + " data - expected an array as the iterator.";
                            throw err;
                        }
                        promises = [];
                        d = JSON.parse(JSON.stringify(dataArray));
                        _loop_1 = function (k) {
                            promises.push(
                            // tslint:disable-next-line: ter-arrow-parens
                            new Promise(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                var t, k2, loopItem, k2, r;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            t = ts.copy();
                                            // temporarily set $index and $this
                                            if (typeof d[k] === 'object') {
                                                d[k]['$key'] = k;
                                                d[k]['$this'] = d[k];
                                                d[k]['$root'] = data['$root'];
                                                // Copy in the memory
                                                for (k2 in t.memory) {
                                                    // Only if we do not override anything
                                                    if (d[k][k2] === undefined) {
                                                        d[k][k2] = t.memory[k2];
                                                    }
                                                }
                                            }
                                            return [4 /*yield*/, t.run(template[key], d[k])];
                                        case 1:
                                            loopItem = _a.sent();
                                            // clean up $index and $this
                                            if (typeof d[k] === 'object') {
                                                delete d[k]['$key'];
                                                delete d[k]['$this'];
                                                delete d[k]['$root'];
                                                // Copy in the memory
                                                // tslint:disable-next-line: forin
                                                for (k2 in t.memory) {
                                                    // Delete what we added
                                                    delete d[k][k2];
                                                }
                                            }
                                            r = {};
                                            r[k] = loopItem;
                                            res(r);
                                            return [2 /*return*/];
                                    }
                                });
                            }); }));
                        };
                        for (k in d) {
                            _loop_1(k);
                        }
                        _b = (_a = Object.assign).apply;
                        _c = [Object];
                        _d = [[{}]];
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1: return [2 /*return*/, _b.apply(_a, _c.concat([__spreadArray.apply(void 0, _d.concat([(_e.sent())]))]))];
                }
            });
        });
    };
    For.prototype.executeSync = function (template, data, ts, key, result) {
        var fun = internal_1.Helper.tokenize(key);
        // newData will be filled with parsed results
        var dataArray = internal_1.Helper.fillout('{{' + fun.expression + '}}', data, true);
        // Ideally newData should be an array since it was prefixed by #each
        if (!dataArray) {
            var err = internal_1.ST_ERRORS.data;
            err.message += " - Wrong " + For.name + " data - expected an array as the iterator.";
            throw err;
        }
        result = [];
        for (var k in dataArray) {
            // temporarily set $index and $this
            if (typeof dataArray[k] === 'object') {
                dataArray[k]['$key'] = k;
                dataArray[k]['$this'] = dataArray[k];
                dataArray[k]['$root'] = data['$root'];
                // Copy in the memory
                for (var k2 in ts.memory) {
                    // Only if we do not override anything
                    if (dataArray[k][k2] === undefined) {
                        dataArray[k][k2] = ts.memory[k2];
                    }
                }
            }
            else {
                String.prototype.$key = k;
                String.prototype.$this = dataArray[k];
                Number.prototype.$key = k;
                Number.prototype.$this = dataArray[k];
                Function.prototype.$key = k;
                Function.prototype.$this = dataArray[k];
                Array.prototype.$key = k;
                Array.prototype.$this = dataArray[k];
                Boolean.prototype.$key = k;
                Boolean.prototype.$this = dataArray[k];
            }
            // run
            var loopItem = ts.runSync(template[key], dataArray[k]);
            // clean up $key and $this
            if (typeof dataArray[k] === 'object') {
                delete dataArray[k]['$key'];
                delete dataArray[k]['$this'];
                delete dataArray[k]['$root'];
                // Copy in the memory
                // tslint:disable-next-line: forin
                for (var k2 in ts.memory) {
                    // Delete what we added
                    delete dataArray[k][k2];
                }
            }
            else {
                delete String.prototype.$key;
                delete String.prototype.$this;
                delete Number.prototype.$key;
                delete Number.prototype.$this;
                delete Function.prototype.$key;
                delete Function.prototype.$this;
                delete Array.prototype.$key;
                delete Array.prototype.$this;
                delete Boolean.prototype.$key;
                delete Boolean.prototype.$this;
            }
            result[k] = loopItem;
        }
        return result;
    };
    return For;
}());
exports.For = For;

},{"../internal":7}],12:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
exports.executors = void 0;
__exportStar(require("./key-executor"), exports);
var concat_1 = require("./concat");
var each_1 = require("./each");
var flatten_1 = require("./flatten");
var let_1 = require("./let");
var lets_1 = require("./lets");
var merge_1 = require("./merge");
var optional_1 = require("./optional");
var for_1 = require("./for");
var unwrap_1 = require("./unwrap");
/**
 * Array of executors for functions in templates.
 */
exports.executors = [
    new concat_1.Concat(),
    new each_1.Each(),
    new flatten_1.Flatten(),
    new for_1.For(),
    new let_1.Let(),
    new lets_1.Lets(),
    new merge_1.Merge(),
    new optional_1.Optional(),
    new unwrap_1.Unwrap(),
];

},{"./concat":8,"./each":9,"./flatten":10,"./for":11,"./key-executor":13,"./let":14,"./lets":15,"./merge":16,"./optional":17,"./unwrap":18}],13:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],14:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Let = void 0;
var internal_1 = require("../internal");
var Let = /** @class */ (function () {
    function Let() {
        this.name = Let.name;
    }
    Let.prototype.getName = function () {
        return this.name;
    };
    Let.prototype.fits = function (template) {
        return (typeof template === 'string' &&
            /^\s*\{\{\s*#let\s*\}\}\s*$/g.test(template.toLowerCase()));
    };
    Let.prototype.executeSync = function (template, data, ts, key, result) {
        result = {};
        // Check the format
        if (!internal_1.Helper.isArray(template[key]) || template[key].length !== 2) {
            var err = internal_1.ST_ERRORS.format;
            err.message += " - Wrong " + Let.name + " format - expected an array with two elements.";
            throw err;
        }
        var defs = template[key][0];
        var realTemplate = template[key][1];
        // 1. Parse the first item to assign variables
        var parsed = ts.runSync(defs, data);
        // 2. modify the data
        var originals = {};
        var memory = {};
        // tslint:disable-next-line: forin
        for (var k in parsed) {
            // save old
            originals[k] = data[k];
            memory[k] = ts.memory[k];
            // set new
            data[k] = parsed[k];
            ts.memory[k] = parsed[k];
        }
        // 3. Pass it into TRANSFORM.run
        result = ts.runSync(realTemplate, data);
        // 4. Remove the data from memory
        // tslint:disable-next-line: forin
        for (var k in parsed) {
            // load old (deletes automatically)
            data[k] = originals[k];
            ts.memory[k] = memory[k];
        }
        return result;
    };
    Let.prototype.execute = function (template, data, ts, key, result) {
        return __awaiter(this, void 0, void 0, function () {
            var err, defs, realTemplate, parsed, originals, memory, k, k;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = {};
                        // Check the format
                        if (!internal_1.Helper.isArray(template[key]) || template[key].length !== 2) {
                            err = internal_1.ST_ERRORS.format;
                            err.message += " - Wrong " + Let.name + " format - expected an array with two elements.";
                            throw err;
                        }
                        defs = template[key][0];
                        realTemplate = template[key][1];
                        return [4 /*yield*/, ts.run(defs, data)];
                    case 1:
                        parsed = _a.sent();
                        originals = {};
                        memory = {};
                        // tslint:disable-next-line: forin
                        for (k in parsed) {
                            // save old
                            originals[k] = data[k];
                            memory[k] = ts.memory[k];
                            // set new
                            data[k] = parsed[k];
                            ts.memory[k] = parsed[k];
                        }
                        return [4 /*yield*/, ts.run(realTemplate, data)];
                    case 2:
                        // 3. Pass it into TRANSFORM.run
                        result = _a.sent();
                        // 4. Remove the data from memory
                        // tslint:disable-next-line: forin
                        for (k in parsed) {
                            // load old (deletes automatically)
                            data[k] = originals[k];
                            ts.memory[k] = memory[k];
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return Let;
}());
exports.Let = Let;

},{"../internal":7}],15:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Lets = void 0;
var internal_1 = require("../internal");
var Lets = /** @class */ (function () {
    function Lets() {
        this.name = Lets.name;
    }
    Lets.prototype.getName = function () {
        return this.name;
    };
    Lets.prototype.fits = function (template) {
        return (typeof template === 'string' &&
            /^\s*\{\{\s*#lets\s*\}\}\s*$/g.test(template.toLowerCase()));
    };
    Lets.prototype.executeSync = function (template, data, ts, key, result) {
        result = {};
        // Check the format
        if (!internal_1.Helper.isArray(template[key]) || template[key].length !== 2) {
            var err = internal_1.ST_ERRORS.format;
            err.message += " - Wrong " + Lets.name + " format - expected an array with two elements.";
            throw err;
        }
        var defs = template[key][0];
        var realTemplate = template[key][1];
        // 1. Parse the first item to assign variables
        var originals = {};
        var memory = {};
        // tslint:disable-next-line: forin
        for (var k in defs) {
            var parsed = ts.runSync(defs[k], data);
            // 2. modify the data
            // save old
            originals[k] = data[k];
            memory[k] = ts.memory[k];
            // set new
            data[k] = parsed;
            ts.memory[k] = parsed;
        }
        // 3. Pass it into TRANSFORM.run
        result = ts.runSync(realTemplate, data);
        // 4. Remove the data from memory
        // tslint:disable-next-line: forin
        for (var k in defs) {
            // load old (deletes automatically)
            data[k] = originals[k];
            ts.memory[k] = memory[k];
        }
        return result;
    };
    Lets.prototype.execute = function (template, data, ts, key, result) {
        return __awaiter(this, void 0, void 0, function () {
            var err, defs, realTemplate, originals, memory, _a, _b, _i, k, parsed, k;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = {};
                        // Check the format
                        if (!internal_1.Helper.isArray(template[key]) || template[key].length !== 2) {
                            err = internal_1.ST_ERRORS.format;
                            err.message += " - Wrong " + Lets.name + " format - expected an array with two elements.";
                            throw err;
                        }
                        defs = template[key][0];
                        realTemplate = template[key][1];
                        originals = {};
                        memory = {};
                        _a = [];
                        for (_b in defs)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        k = _a[_i];
                        return [4 /*yield*/, ts.run(defs[k], data)];
                    case 2:
                        parsed = _c.sent();
                        // 2. modify the data
                        // save old
                        originals[k] = data[k];
                        memory[k] = ts.memory[k];
                        // set new
                        data[k] = parsed;
                        ts.memory[k] = parsed;
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, ts.run(realTemplate, data)];
                    case 5:
                        // 3. Pass it into TRANSFORM.run
                        result = _c.sent();
                        // 4. Remove the data from memory
                        // tslint:disable-next-line: forin
                        for (k in defs) {
                            // load old (deletes automatically)
                            data[k] = originals[k];
                            ts.memory[k] = memory[k];
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return Lets;
}());
exports.Lets = Lets;

},{"../internal":7}],16:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.Merge = void 0;
var internal_1 = require("../internal");
var Merge = /** @class */ (function () {
    function Merge() {
        this.name = Merge.name;
    }
    Merge.prototype.getName = function () {
        return this.name;
    };
    Merge.prototype.fits = function (template) {
        return (typeof template === 'string' &&
            /^\s*\{\{\s*#merge\s*\}\}\s*$/g.test(template.toLowerCase()));
    };
    Merge.prototype.executeSync = function (template, data, ts, key, result) {
        if (!internal_1.Helper.isArray(template[key])) {
            var err = internal_1.ST_ERRORS.format;
            err.message += " - Wrong " + Merge.name + " format - expected an array as the value.";
            throw err;
        }
        // Merge all sub-objects
        result = {};
        for (var _i = 0, _a = template[key]; _i < _a.length; _i++) {
            var item = _a[_i];
            Object.assign(result, ts.runSync(item, data));
        }
        // clean up $index from the result
        // necessary because #merge merges multiple objects into one,
        // and one of them may be 'this', in which case the $index attribute
        // will have snuck into the final result
        if (typeof data === 'object') {
            delete result['$index'];
        }
        else {
            delete String.prototype.$index;
            delete Number.prototype.$index;
            delete Function.prototype.$index;
            delete Array.prototype.$index;
            delete Boolean.prototype.$index;
        }
        return result;
    };
    Merge.prototype.execute = function (template, data, ts, key, result) {
        return __awaiter(this, void 0, void 0, function () {
            var err, promises, _i, _a, item, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!internal_1.Helper.isArray(template[key])) {
                            err = internal_1.ST_ERRORS.format;
                            err.message += " - Wrong " + Merge.name + " format - expected an array as the value.";
                            throw err;
                        }
                        // Merge all sub-objects
                        result = {};
                        promises = [];
                        for (_i = 0, _a = template[key]; _i < _a.length; _i++) {
                            item = _a[_i];
                            promises.push(ts.run(item, data));
                        }
                        _c = (_b = Object.assign).apply;
                        _d = [Object];
                        _e = [[result]];
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _c.apply(_b, _d.concat([__spreadArray.apply(void 0, _e.concat([(_f.sent())]))]));
                        // clean up $index from the result
                        // necessary because #merge merges multiple objects into one,
                        // and one of them may be 'this', in which case the $index attribute
                        // will have snuck into the final result
                        if (typeof data === 'object') {
                            delete result['$index'];
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return Merge;
}());
exports.Merge = Merge;

},{"../internal":7}],17:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Optional = void 0;
var internal_1 = require("../internal");
var Optional = /** @class */ (function () {
    function Optional() {
        this.name = Optional.name;
    }
    Optional.prototype.getName = function () {
        return this.name;
    };
    Optional.prototype.fits = function (template) {
        return (typeof template === 'string' &&
            /^\s*\{\{\s*#optional\s+[^\s]+\s*\}\}\s*$/g.test(template.toLowerCase()));
    };
    Optional.prototype.executeSync = function (template, data, ts, key, result) {
        var fun = internal_1.Helper.tokenize(key);
        // Resolve the value
        var ret = ts.runSync(template[key], data);
        // If value does not fit conditions
        if (!ret ||
            ret === null ||
            ret === undefined ||
            (typeof ret === 'object' && Object.keys(ret).length === 0) ||
            (internal_1.Helper.isArray(ret) && ret.length === 0)) {
            // We want to ignore these cases
        }
        else {
            // Otw, include it into the result
            result[fun.expression] = ret;
        }
        return result;
    };
    Optional.prototype.execute = function (template, data, ts, key, result) {
        return __awaiter(this, void 0, void 0, function () {
            var fun, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fun = internal_1.Helper.tokenize(key);
                        return [4 /*yield*/, ts.run(template[key], data)];
                    case 1:
                        ret = _a.sent();
                        // If value does not fit conditions
                        if (!ret ||
                            ret === null ||
                            ret === undefined ||
                            (typeof ret === 'object' && Object.keys(ret).length === 0) ||
                            (internal_1.Helper.isArray(ret) && ret.length === 0)) {
                            // We want to ignore these cases
                        }
                        else {
                            // Otw, include it into the result
                            result[fun.expression] = ret;
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return Optional;
}());
exports.Optional = Optional;

},{"../internal":7}],18:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Unwrap = void 0;
var internal_1 = require("../internal");
var Unwrap = /** @class */ (function () {
    function Unwrap() {
        this.name = Unwrap.name;
    }
    Unwrap.prototype.getName = function () {
        return this.name;
    };
    Unwrap.prototype.fits = function (template) {
        return (typeof template === 'string' &&
            /^\s*\{\{\s*#unwrap\s*[^\s]*\s*\}\}\s*$/g.test(template.toLowerCase()));
    };
    Unwrap.prototype.executeSync = function (template, data, ts, key, result) {
        if (typeof template[key] !== 'object') {
            var err = internal_1.ST_ERRORS.format;
            err.message += " - Wrong " + Unwrap.name + " format - expected an object as the value.";
            throw err;
        }
        var fun = internal_1.Helper.tokenize(key);
        var config = template[key];
        var exclude = config.exclude || [];
        var attach = ts.runSync(config.attach || {}, data);
        result = fun.expression !== '' ? data[fun.expression] : data;
        for (var _i = 0, exclude_1 = exclude; _i < exclude_1.length; _i++) {
            var k = exclude_1[_i];
            delete result[k];
        }
        // tslint:disable-next-line: forin
        for (var k in attach) {
            result[k] = attach[k];
        }
        return result;
    };
    Unwrap.prototype.execute = function (template, data, ts, key, result) {
        return __awaiter(this, void 0, void 0, function () {
            var err, fun, config, exclude, attach, _i, exclude_2, k, k;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof template[key] !== 'object') {
                            err = internal_1.ST_ERRORS.format;
                            err.message += " - Wrong " + Unwrap.name + " format - expected an object as the value.";
                            throw err;
                        }
                        fun = internal_1.Helper.tokenize(key);
                        config = template[key];
                        exclude = config.exclude || [];
                        return [4 /*yield*/, ts.run(config.attach || {}, data)];
                    case 1:
                        attach = (_a.sent());
                        result = fun.expression !== '' ? data[fun.expression] : data;
                        for (_i = 0, exclude_2 = exclude; _i < exclude_2.length; _i++) {
                            k = exclude_2[_i];
                            delete result[k];
                        }
                        // tslint:disable-next-line: forin
                        for (k in attach) {
                            result[k] = attach[k];
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return Unwrap;
}());
exports.Unwrap = Unwrap;

},{"../internal":7}],19:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Select = void 0;
var internal_1 = require("./internal");
var Select = /** @class */ (function () {
    function Select(st, sync) {
        if (sync === void 0) { sync = false; }
        this.st = st;
        this.sync = sync;
    }
    Select.prototype.root = function () {
        this.$progress = null;
        return this.$selectedRoot;
    };
    Select.prototype.values = function () {
        this.$progress = null;
        if (this.$selected) {
            return this.$selected.map(function (item) { return item.value; });
        }
        return Object.values(this.$selectedRoot);
    };
    Select.prototype.paths = function () {
        this.$progress = null;
        if (this.$selected) {
            return this.$selected.map(function (item) { return item.path; });
        }
        if (Array.isArray(this.$selectedRoot)) {
            return Object.keys(this.$selectedRoot).map(function (item) {
                // key is integer
                return "[" + item + "]";
            });
        }
        return Object.keys(this.$selectedRoot).map(function (item) {
            // key is string
            return "[" + item + "]";
        });
    };
    Select.prototype.keys = function () {
        this.$progress = null;
        if (this.$selected) {
            return this.$selected.map(function (item) { return item.key; });
        }
        if (Array.isArray(this.$selectedRoot)) {
            return Object.keys(this.$selectedRoot).map(function (key) { return parseInt(key, 0); });
        }
        return Object.keys(this.$selectedRoot);
    };
    Select.prototype.objects = function () {
        this.$progress = null;
        if (this.$selected) {
            return this.$selected.map(function (item) { return item.object; });
        }
        return [this.$selectedRoot];
    };
    Select.prototype.transformSync = function (obj, serialized) {
        var _this = this;
        this.$progress = null;
        /*
              'selected' is an array that contains items that looks like this:
                  {
                    key: The selected key,
                    path: The path leading down to the selected key,
                    object: The entire object that contains the currently selected key/val pair
                    value: The selected value
                  }
            */
        var data;
        try {
            if (serialized)
                data = JSON.parse(obj);
            else
                data = obj;
        }
        catch (error) {
            data = obj;
        }
        // since we're assuming that the template has been already selected,
        // the $template_root is $selected_root
        this.$templateRoot = this.$selectedRoot;
        String.prototype.$root = data;
        Number.prototype.$root = data;
        Function.prototype.$root = data;
        Array.prototype.$root = data;
        Boolean.prototype.$root = data;
        if (typeof data === 'object') {
            data.$root = data;
        }
        String.prototype.$this = data;
        Number.prototype.$this = data;
        Function.prototype.$this = data;
        Array.prototype.$this = data;
        Boolean.prototype.$this = data;
        if (typeof data === 'object') {
            data.$this = data;
        }
        try {
            if (this.$selected && this.$selected.length > 0) {
                this.$selected
                    .sort(function (a, b) {
                    // sort by path length, so that deeper level items will be replaced
                    // first
                    // TODO: may need to look into edge cases
                    return b.path.length - a.path.length;
                })
                    .forEach(function (selection) { return _this.transformSelectedItem(selection, data); });
                this.$selected.sort(function (a, b) { return a.index - b.index; });
            }
            else {
                var parsedObject = new internal_1.Transform(this, this.st, this.sync).runSync(this.$selectedRoot, data);
                // apply the result to root
                this.$templateRoot = internal_1.Helper.resolve(this.$templateRoot, '', parsedObject);
                this.$selectedRoot = this.$templateRoot;
            }
        }
        finally {
            if (typeof data === 'object') {
                data.$root = undefined;
            }
            delete String.prototype.$root;
            delete Number.prototype.$root;
            delete Function.prototype.$root;
            delete Array.prototype.$root;
            delete Boolean.prototype.$root;
            if (typeof data === 'object') {
                data.$this = undefined;
            }
            delete String.prototype.$this;
            delete Number.prototype.$this;
            delete Function.prototype.$this;
            delete Array.prototype.$this;
            delete Boolean.prototype.$this;
        }
        return this;
    };
    Select.prototype.transform = function (obj, serialized) {
        return __awaiter(this, void 0, void 0, function () {
            var data, sorted, promises, _loop_1, _i, sorted_1, selection, parsedObject;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.$progress = null;
                        try {
                            if (serialized)
                                data = JSON.parse(obj);
                            else
                                data = obj;
                        }
                        catch (error) {
                            data = obj;
                        }
                        // since we're assuming that the template has been already selected,
                        // the $templateRoot is $selectedRoot
                        this.$templateRoot = this.$selectedRoot;
                        if (typeof data === 'object') {
                            data.$root = data;
                        }
                        String.prototype.$root = data;
                        Number.prototype.$root = data;
                        Function.prototype.$root = data;
                        Array.prototype.$root = data;
                        Boolean.prototype.$root = data;
                        if (typeof data === 'object') {
                            data.$this = data;
                        }
                        String.prototype.$this = data;
                        Number.prototype.$this = data;
                        Function.prototype.$this = data;
                        Array.prototype.$this = data;
                        Boolean.prototype.$this = data;
                        if (!(this.$selected && this.$selected.length > 0)) return [3 /*break*/, 2];
                        sorted = this.$selected.sort(function (a, b) {
                            // sort by path length, so that deeper level items will be replaced first
                            // TODO: may need to look into edge cases
                            return b.path.length - a.path.length;
                        });
                        promises = [];
                        _loop_1 = function (selection) {
                            promises.push(new Promise(function () { return __awaiter(_this, void 0, void 0, function () {
                                var parsedObject;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, new internal_1.Transform(this, this.st).run(selection.object, data)];
                                        case 1:
                                            parsedObject = _a.sent();
                                            // apply the result to root
                                            this.$templateRoot = internal_1.Helper.resolve(this.$templateRoot, selection.path, parsedObject);
                                            this.$selectedRoot = this.$templateRoot;
                                            // update selected object with the parsed result
                                            selection.object = parsedObject;
                                            return [2 /*return*/];
                                    }
                                });
                            }); }));
                        };
                        for (_i = 0, sorted_1 = sorted; _i < sorted_1.length; _i++) {
                            selection = sorted_1[_i];
                            _loop_1(selection);
                        }
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        this.$selected.sort(function (a, b) { return a.index - b.index; });
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, new internal_1.Transform(this, this.st, this.sync).run(this.$selectedRoot, data)];
                    case 3:
                        parsedObject = _a.sent();
                        // apply the result to root
                        this.$templateRoot = internal_1.Helper.resolve(this.$templateRoot, '', parsedObject);
                        this.$selectedRoot = this.$templateRoot;
                        _a.label = 4;
                    case 4:
                        if (typeof data === 'object') {
                            data.$root = undefined;
                        }
                        delete String.prototype.$root;
                        delete Number.prototype.$root;
                        delete Function.prototype.$root;
                        delete Array.prototype.$root;
                        delete Boolean.prototype.$root;
                        if (typeof data === 'object') {
                            data.$this = undefined;
                        }
                        delete String.prototype.$this;
                        delete Number.prototype.$this;
                        delete Function.prototype.$this;
                        delete Array.prototype.$this;
                        delete Boolean.prototype.$this;
                        return [2 /*return*/, this];
                }
            });
        });
    };
    Select.prototype.transformWithSync = function (obj, serialized) {
        var _this = this;
        this.$progress = null;
        /*
         *  'selected' is an array that contains items that looks like this:
         *  {
         *    key: The selected key,
         *    path: The path leading down to the selected key,
         *    object: The entire object that contains the currently selected key/val pair
         *    value: The selected value
         *  }
         */
        var template;
        try {
            if (serialized)
                template = JSON.parse(obj);
            else
                template = obj;
        }
        catch (error) {
            template = obj;
        }
        // Setting $root
        this.$templateRoot = template;
        if (typeof template === 'object') {
            template.$root = this.$templateRoot;
        }
        String.prototype.$root = this.$templateRoot;
        Number.prototype.$root = this.$templateRoot;
        Function.prototype.$root = this.$templateRoot;
        Array.prototype.$root = this.$templateRoot;
        Boolean.prototype.$root = this.$templateRoot;
        if (typeof template === 'object') {
            template.$this = this.$templateRoot;
        }
        String.prototype.$this = this.$templateRoot;
        Number.prototype.$this = this.$templateRoot;
        Function.prototype.$this = this.$templateRoot;
        Array.prototype.$this = this.$templateRoot;
        Boolean.prototype.$this = this.$templateRoot;
        try {
            // generate new $selected_root
            if (this.$selected && this.$selected.length > 0) {
                this.$selected
                    .sort(function (a, b) {
                    // sort by path length, so that deeper level items will be replaced first
                    // TODO: may need to look into edge cases
                    return b.path.length - a.path.length;
                })
                    .forEach(function (selection) {
                    return _this.transformSelectedItemWith(selection, template);
                });
                this.$selected.sort(function (a, b) { return a.index - b.index; });
            }
            else {
                var parsedObject = new internal_1.Transform(this, this.st, this.sync).runSync(template, this.$selectedRoot);
                // apply the result to root
                this.$selectedRoot = internal_1.Helper.resolve(this.$selectedRoot, '', parsedObject);
            }
        }
        finally {
            if (typeof template === 'object') {
                template.$root = undefined;
            }
            delete String.prototype.$root;
            delete Number.prototype.$root;
            delete Function.prototype.$root;
            delete Array.prototype.$root;
            delete Boolean.prototype.$root;
            if (typeof template === 'object') {
                template.$this = undefined;
            }
            delete String.prototype.$this;
            delete Number.prototype.$this;
            delete Function.prototype.$this;
            delete Array.prototype.$this;
            delete Boolean.prototype.$this;
        }
        return this;
    };
    Select.prototype.transformWith = function (obj, serialized) {
        return __awaiter(this, void 0, void 0, function () {
            var template, sorted, promises, _loop_2, _i, sorted_2, selection, parsedObject;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.$progress = null;
                        try {
                            if (serialized)
                                template = JSON.parse(obj);
                            else
                                template = obj;
                        }
                        catch (error) {
                            template = obj;
                        }
                        // Setting $root
                        this.$templateRoot = template;
                        if (!(this.$selected && this.$selected.length > 0)) return [3 /*break*/, 2];
                        sorted = this.$selected.sort(function (a, b) {
                            // sort by path length, so that deeper level items will be replaced first
                            // TODO: may need to look into edge cases
                            return b.path.length - a.path.length;
                        });
                        promises = [];
                        _loop_2 = function (selection) {
                            promises.push(new Promise(function () { return __awaiter(_this, void 0, void 0, function () {
                                var parsedObject;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, new internal_1.Transform(this, this.st, this.sync).run(template, selection.object)];
                                        case 1:
                                            parsedObject = _a.sent();
                                            // apply the result to root
                                            this.$selectedRoot = internal_1.Helper.resolve(this.$selectedRoot, selection.path, parsedObject);
                                            // update selected object with the parsed result
                                            selection.object = parsedObject;
                                            return [2 /*return*/];
                                    }
                                });
                            }); }));
                        };
                        for (_i = 0, sorted_2 = sorted; _i < sorted_2.length; _i++) {
                            selection = sorted_2[_i];
                            _loop_2(selection);
                        }
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        this.$selected.sort(function (a, b) { return a.index - b.index; });
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, new internal_1.Transform(this, this.st, this.sync).run(template, this.$selectedRoot)];
                    case 3:
                        parsedObject = _a.sent();
                        // apply the result to root
                        this.$selectedRoot = internal_1.Helper.resolve(this.$selectedRoot, '', parsedObject);
                        _a.label = 4;
                    case 4: return [2 /*return*/, this];
                }
            });
        });
    };
    Select.prototype.inject = function (obj, serialized) {
        try {
            if (serialized)
                this.$injected = JSON.parse(obj);
            else
                this.$injected = obj;
        }
        catch (error) {
            this.$injected = obj;
        }
        if (Object.keys(this.$injected).length > 0) {
            this.select(this.$injected, undefined, undefined);
        }
        return this;
    };
    Select.prototype.exec = function (current, path, filter) {
        // if current matches the pattern, put it in the selected array
        if (typeof current === 'string') {
            // leaf node should be ignored
            // we're lookin for keys only
            return;
        }
        if (internal_1.Helper.isArray(current)) {
            for (var i = 0; i < current.length; i++) {
                this.exec(current[i], path + "[" + i + "]", filter);
            }
            return;
        }
        // object
        for (var key in current) {
            // '$root' is a special key that links to the root node
            // so shouldn't be used to iterate
            if (key !== '$root') {
                if (filter(key, current[key])) {
                    var index = this.$selected.length;
                    this.$selected.push({
                        index: index,
                        key: key,
                        path: path,
                        object: current,
                        value: current[key]
                    });
                }
                this.exec(current[key], path + "[\"" + key + "\"]", filter);
            }
        }
    };
    Select.prototype.select = function (obj, filter, serialized) {
        // iterate '$selected'
        //
        /*
                SELECT.$selected = [{
                    value {
                        '{{#include}}': {
                            '{{#each items}}': {
                                'type': 'label',
                                'text': '{{name}}'
                            }
                        }
                    },
                    path: '$jason.head.actions.$load'
                    ...
                }]
            */
        var json;
        try {
            if (serialized)
                json = JSON.parse(obj);
            else
                json = obj;
        }
        catch (error) {
            json = obj;
        }
        if (filter) {
            this.$selected = [];
            this.exec(json, '', filter);
        }
        else {
            this.$selected = null;
        }
        if (json && (internal_1.Helper.isArray(json) || typeof json === 'object')) {
            if (!this.$progress) {
                // initialize
                if (internal_1.Helper.isArray(json)) {
                    this.$val = [];
                    this.$selectedRoot = [];
                }
                else {
                    this.$val = {};
                    this.$selectedRoot = {};
                }
            }
            // tslint:disable-next-line: forin
            for (var key in json) {
                this.$val[key] = json[key];
                this.$selectedRoot[key] = json[key];
            }
        }
        else {
            this.$val = json;
            this.$selectedRoot = json;
        }
        this.$progress = true; // set the 'in progress' flag
        return this;
    };
    Select.prototype.transformSelectedItemWith = function (selection, template) {
        // parse selected
        var parsedObject = new internal_1.Transform(this, this.st, this.sync).runSync(template, selection.object);
        // apply the result to root
        this.$selectedRoot = internal_1.Helper.resolve(this.$selectedRoot, selection.path, parsedObject);
        // update selected object with the parsed result
        selection.object = parsedObject;
    };
    Select.prototype.transformSelectedItem = function (selection, data) {
        // parse selected
        var parsedObject = new internal_1.Transform(this, this.st).runSync(selection.object, data);
        // apply the result to root
        this.$templateRoot = internal_1.Helper.resolve(this.$templateRoot, selection.path, parsedObject);
        this.$selectedRoot = this.$templateRoot;
        // update selected object with the parsed result
        selection.object = parsedObject;
    };
    return Select;
}());
exports.Select = Select;

},{"./internal":7}],20:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.SelectTransform = void 0;
var internal_1 = require("./internal");
/**
 * Select-Transform class
 */
var SelectTransform = /** @class */ (function () {
    /**
     *
     * @param {boolean} keepTemplate Whether to keep templates instead of firing errors
     */
    function SelectTransform(keepTemplate) {
        if (keepTemplate === void 0) { keepTemplate = false; }
        this.keepTemplate = keepTemplate;
        this.templates = {};
    }
    /**
     * Adds subtemplates that should be used into the class.
     * If a template with same name is already present, it will be overriden by this method.
     *
     * @param {object} subtemplates Provided subtemplates
     */
    SelectTransform.prototype.addTemplates = function (subtemplates) {
        Object.assign(this.templates, subtemplates);
        return this;
    };
    /**
     * Clears template library.
     */
    SelectTransform.prototype.clearTemplates = function () {
        this.templates = {};
        return this;
    };
    SelectTransform.prototype.getTemplate = function (name) {
        return this.templates[name];
    };
    SelectTransform.prototype.transformSync = function (template, data, serialized) {
        // no need for separate template resolution step
        // select the template with selector and transform data
        var res = new internal_1.Select(this, true)
            .select(template, undefined, serialized)
            .transformSync(data, serialized)
            .root();
        if (serialized) {
            // needs to return stringified version
            return JSON.stringify(res);
        }
        return res;
    };
    SelectTransform.prototype.transform = function (template, data, serialized) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new internal_1.Select(this, true)
                            .select(template, undefined, serialized)
                            .transform(data, serialized)];
                    case 1:
                        res = (_a.sent()).root();
                        if (serialized) {
                            // needs to return stringified version
                            return [2 /*return*/, JSON.stringify(res)];
                        }
                        return [2 /*return*/, res];
                }
            });
        });
    };
    SelectTransform.prototype.selectSync = function (template, selector, serialized) {
        if (serialized === void 0) { serialized = false; }
        var res = new internal_1.Select(this, true).select(template, selector, serialized);
        if (serialized) {
            // needs to return stringified version
            return JSON.stringify(res.root());
        }
        return res;
    };
    SelectTransform.prototype.select = function (template, selector, serialized) {
        if (serialized === void 0) { serialized = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.selectSync(template, selector, serialized)];
            });
        });
    };
    return SelectTransform;
}());
exports.SelectTransform = SelectTransform;

},{"./internal":7}],21:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Transform = void 0;
var internal_1 = require("./internal");
var Transform = /** @class */ (function () {
    function Transform(select, st, sync) {
        if (sync === void 0) { sync = false; }
        this.select = select;
        this.st = st;
        this.sync = sync;
        this.memory = {};
    }
    Transform.prototype.copy = function () {
        var cp = new Transform(this.select, this.st, this.sync);
        // TODO: Something more efficient?
        cp.memory = JSON.parse(JSON.stringify(this.memory));
        return cp;
    };
    Transform.prototype.runSync = function (template, data) {
        var _this = this;
        var result;
        try {
            if (typeof template === 'string') {
                if (!internal_1.Helper.isTemplate(template))
                    return template;
                for (var _i = 0, valueExecutors_1 = internal_1.valueExecutors; _i < valueExecutors_1.length; _i++) {
                    var executor = valueExecutors_1[_i];
                    if (executor.fits(template)) {
                        // tslint:disable-next-line: no-console
                        console.debug(JSON.stringify(template, null, 2) + " fits executor " + executor.getName());
                        return executor.executeSync(template, data, this);
                    }
                }
                try {
                    return internal_1.Helper.fillout(template, data, false, this.st.keepTemplate);
                }
                catch (error) {
                    error.message += " -- " + template;
                    throw error;
                }
            }
        }
        catch (error) {
            if (!this.st.keepTemplate)
                throw error;
            return template;
        }
        if (internal_1.Helper.isArray(template)) {
            for (var _a = 0, arrayExecutors_1 = internal_1.arrayExecutors; _a < arrayExecutors_1.length; _a++) {
                var executor = arrayExecutors_1[_a];
                if (executor.fits(template)) {
                    // tslint:disable-next-line: no-console
                    console.debug(JSON.stringify(template, null, 2) + " fits executor " + executor.getName());
                    try {
                        return executor.executeSync(template, data, this);
                    }
                    catch (error) {
                        if (!this.st.keepTemplate)
                            throw error;
                        return template;
                    }
                }
            }
            return template.map(function (item) { return _this.runSync(item, data); });
        }
        if (Object.prototype.toString.call(template) === '[object Object]') {
            // template is an object
            result = {};
            // tslint:disable-next-line: forin
            for (var key in template) {
                try {
                    if (!internal_1.Helper.isTemplate(key)) {
                        result[key] = this.runSync(template[key], data);
                        continue;
                    }
                    var executed = false;
                    for (var _b = 0, keyExecutors_1 = internal_1.keyExecutors; _b < keyExecutors_1.length; _b++) {
                        var executor = keyExecutors_1[_b];
                        if (executor.fits(key)) {
                            // tslint:disable-next-line: no-console
                            console.debug(JSON.stringify(key, null, 2) + " fits executor " + executor.getName());
                            result = executor.executeSync(template, data, this, key, result);
                            executed = true;
                            break;
                        }
                    }
                    if (!executed) {
                        try {
                            var newKey = internal_1.Helper.fillout(key, data, false, this.st.keepTemplate);
                            var newValue = this.runSync(template[key], data);
                            if (newKey in result) {
                                throwDuplicateKeyError(newKey);
                            }
                            result[newKey] = newValue;
                        }
                        catch (error) {
                            error.message += " -- " + key;
                            throw error;
                        }
                    }
                }
                catch (error) {
                    if (!this.st.keepTemplate)
                        throw error;
                    result[key] = template[key];
                }
            }
        }
        else {
            // hardcoded string
            return template;
        }
        return result;
    };
    Transform.prototype.run = function (template, data) {
        return __awaiter(this, void 0, void 0, function () {
            var result, _i, valueExecutors_2, executor, error_1, _a, arrayExecutors_2, executor, error_2, promises, _loop_1, key;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        if (!(typeof template === 'string')) return [3 /*break*/, 5];
                        if (!internal_1.Helper.isTemplate(template))
                            return [2 /*return*/, template];
                        _i = 0, valueExecutors_2 = internal_1.valueExecutors;
                        _b.label = 1;
                    case 1:
                        if (!(_i < valueExecutors_2.length)) return [3 /*break*/, 4];
                        executor = valueExecutors_2[_i];
                        if (!executor.fits(template)) return [3 /*break*/, 3];
                        // tslint:disable-next-line: no-console
                        console.debug(JSON.stringify(template, null, 2) + " fits executor " + executor.getName());
                        return [4 /*yield*/, executor.execute(template, data, this)];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        try {
                            return [2 /*return*/, internal_1.Helper.fillout(template, data, false, this.st.keepTemplate)];
                        }
                        catch (error) {
                            error.message += " -- " + template;
                            throw error;
                        }
                        _b.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _b.sent();
                        if (!this.st.keepTemplate)
                            throw error_1;
                        return [2 /*return*/, template];
                    case 7:
                        if (!internal_1.Helper.isArray(template)) return [3 /*break*/, 15];
                        _a = 0, arrayExecutors_2 = internal_1.arrayExecutors;
                        _b.label = 8;
                    case 8:
                        if (!(_a < arrayExecutors_2.length)) return [3 /*break*/, 13];
                        executor = arrayExecutors_2[_a];
                        if (!executor.fits(template)) return [3 /*break*/, 12];
                        // tslint:disable-next-line: no-console
                        console.debug(JSON.stringify(template, null, 2) + " fits executor " + executor.getName());
                        _b.label = 9;
                    case 9:
                        _b.trys.push([9, 11, , 12]);
                        return [4 /*yield*/, executor.execute(template, data, this)];
                    case 10: return [2 /*return*/, _b.sent()];
                    case 11:
                        error_2 = _b.sent();
                        if (!this.st.keepTemplate)
                            throw error_2;
                        return [2 /*return*/, template];
                    case 12:
                        _a++;
                        return [3 /*break*/, 8];
                    case 13: return [4 /*yield*/, Promise.all(template.map(function (item) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.run(item, data)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); }))];
                    case 14: return [2 /*return*/, _b.sent()];
                    case 15:
                        if (!(Object.prototype.toString.call(template) === '[object Object]')) return [3 /*break*/, 17];
                        // template is an object
                        result = {};
                        promises = [];
                        _loop_1 = function (key) {
                            if (typeof template[key] === 'function') {
                                return "continue";
                            }
                            promises.push(
                            // tslint:disable-next-line: ter-arrow-parens
                            new Promise(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                var _a, _b, _i, keyExecutors_2, executor, newKey, newValue, error_3, error_4;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            _c.trys.push([0, 10, , 11]);
                                            if (!!internal_1.Helper.isTemplate(key)) return [3 /*break*/, 2];
                                            _a = result;
                                            _b = key;
                                            return [4 /*yield*/, this.run(template[key], data)];
                                        case 1:
                                            _a[_b] = _c.sent();
                                            res();
                                            return [2 /*return*/];
                                        case 2:
                                            _i = 0, keyExecutors_2 = internal_1.keyExecutors;
                                            _c.label = 3;
                                        case 3:
                                            if (!(_i < keyExecutors_2.length)) return [3 /*break*/, 6];
                                            executor = keyExecutors_2[_i];
                                            if (!executor.fits(key)) return [3 /*break*/, 5];
                                            // tslint:disable-next-line: no-console
                                            console.debug(JSON.stringify(key, null, 2) + " fits executor " + executor.getName());
                                            return [4 /*yield*/, executor.execute(template, data, this, key, result)];
                                        case 4:
                                            result = _c.sent();
                                            res();
                                            return [2 /*return*/];
                                        case 5:
                                            _i++;
                                            return [3 /*break*/, 3];
                                        case 6:
                                            _c.trys.push([6, 8, , 9]);
                                            newKey = internal_1.Helper.fillout(key, data, false, this.st.keepTemplate);
                                            return [4 /*yield*/, this.run(template[key], data)];
                                        case 7:
                                            newValue = _c.sent();
                                            if (newKey in result) {
                                                throwDuplicateKeyError(newKey);
                                            }
                                            result[newKey] = newValue;
                                            res();
                                            return [2 /*return*/];
                                        case 8:
                                            error_3 = _c.sent();
                                            error_3.message += " -- " + key;
                                            throw error_3;
                                        case 9: return [3 /*break*/, 11];
                                        case 10:
                                            error_4 = _c.sent();
                                            if (!this.st.keepTemplate)
                                                throw error_4;
                                            result[key] = template[key];
                                            return [3 /*break*/, 11];
                                        case 11: return [2 /*return*/];
                                    }
                                });
                            }); }));
                        };
                        for (key in template) {
                            _loop_1(key);
                        }
                        return [4 /*yield*/, Promise.all(promises)];
                    case 16:
                        _b.sent();
                        return [3 /*break*/, 18];
                    case 17: 
                    // hardcoded string
                    return [2 /*return*/, template];
                    case 18: return [2 /*return*/, result];
                }
            });
        });
    };
    return Transform;
}());
exports.Transform = Transform;
function throwDuplicateKeyError(newKey) {
    throw new Error("While replacing a templated key in object, found that " +
        ("the target key already exists. -- resolved key: " + newKey));
}

},{"./internal":7}],22:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Include = void 0;
var internal_1 = require("../internal");
var Include = /** @class */ (function () {
    function Include() {
        this.name = Include.name;
    }
    Include.prototype.getName = function () {
        return this.name;
    };
    Include.prototype.fits = function (template) {
        return (typeof template === 'string' &&
            /^\s*\{\{\s*#include\s+[^\s]+\s*\}\}\s*$/g.test(template.toLowerCase()));
    };
    Include.prototype.executeSync = function (template, data, ts) {
        var fun = internal_1.Helper.tokenize(template);
        if (fun.expression) {
            // if #include has arguments, evaluate it before attaching
            return internal_1.Helper.fillout("{{" + fun.expression + "}", data, true);
        }
        // shouldn't happen =>
        // {'wrapper': '{{#include}}'}
        return template;
    };
    Include.prototype.execute = function (template, data, ts) {
        return __awaiter(this, void 0, void 0, function () {
            var fun;
            return __generator(this, function (_a) {
                fun = internal_1.Helper.tokenize(template);
                if (fun.expression) {
                    // if #include has arguments, evaluate it before attaching
                    return [2 /*return*/, internal_1.Helper.fillout("{{" + fun.expression + "}", data, true)];
                }
                // shouldn't happen =>
                // {'wrapper': '{{#include}}'}
                return [2 /*return*/, template];
            });
        });
    };
    return Include;
}());
exports.Include = Include;

},{"../internal":7}],23:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
exports.executors = void 0;
__exportStar(require("./value-executor"), exports);
var template_1 = require("./template");
var include_1 = require("./include");
var ternary_1 = require("./ternary");
/**
 * Array of executors for values in templates.
 */
exports.executors = [
    new template_1.Template(),
    new include_1.Include(),
    new ternary_1.Ternary(),
];

},{"./include":22,"./template":24,"./ternary":25,"./value-executor":26}],24:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Template = void 0;
var internal_1 = require("../internal");
var Template = /** @class */ (function () {
    function Template() {
        this.name = Template.name;
    }
    Template.prototype.getName = function () {
        return this.name;
    };
    Template.prototype.fits = function (template) {
        return (typeof template === 'string' &&
            /^\s*\{\{\s*#template\s+[^\s]+\s*\}\}\s*$/g.test(template.toLowerCase()));
    };
    Template.prototype.executeSync = function (template, data, ts) {
        var fun = internal_1.Helper.tokenize(template);
        // insert one of stored templates
        var ptemplate = ts.st.getTemplate(fun.expression);
        return ts.runSync(ptemplate, data);
    };
    Template.prototype.execute = function (template, data, ts) {
        return __awaiter(this, void 0, void 0, function () {
            var fun, ptemplate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fun = internal_1.Helper.tokenize(template);
                        ptemplate = ts.st.getTemplate(fun.expression);
                        return [4 /*yield*/, ts.run(ptemplate, data)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Template;
}());
exports.Template = Template;

},{"../internal":7}],25:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Ternary = void 0;
var internal_1 = require("../internal");
var Ternary = /** @class */ (function () {
    function Ternary() {
        this.name = Ternary.name;
    }
    Ternary.prototype.getName = function () {
        return this.name;
    };
    Ternary.prototype.fits = function (template) {
        return (typeof template === 'string' &&
            /^\s*\{\{\s*#\?\s+[^\s]+\s*\}\}\s*$/g.test(template.toLowerCase()));
    };
    Ternary.prototype.executeSync = function (template, data, ts) {
        var fun = internal_1.Helper.tokenize(template);
        var filled = internal_1.Helper.fillout("{{" + fun.expression + "}}", data, false, true);
        if (!filled || filled === "{{" + fun.expression + "}}") {
            // case 1.
            // not parsed, which means the evaluation failed.
            // case 2.
            // returns fasly value
            // both cases mean this key should be excluded
        }
        else {
            // only include if the evaluation is truthy
            return filled;
        }
        return undefined;
    };
    Ternary.prototype.execute = function (template, data, ts) {
        return __awaiter(this, void 0, void 0, function () {
            var fun, filled;
            return __generator(this, function (_a) {
                fun = internal_1.Helper.tokenize(template);
                filled = internal_1.Helper.fillout("{{" + fun.expression + "}}", data, false, true);
                if (!filled || filled === "{{" + fun.expression + "}}") {
                    // case 1.
                    // not parsed, which means the evaluation failed.
                    // case 2.
                    // returns fasly value
                    // both cases mean this key should be excluded
                }
                else {
                    // only include if the evaluation is truthy
                    return [2 /*return*/, filled];
                }
                return [2 /*return*/, undefined];
            });
        });
    };
    return Ternary;
}());
exports.Ternary = Ternary;

},{"../internal":7}],26:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}]},{},[1]);
