import { DataObject } from './transform';

class StError extends Error {
  /**
   * Creates an error using the given message.
   *
   * @param {string} message Message of the error
   */
  constructor(message: string) {
    super(message);
  }
}

export type Tokens = {
  name: string;
  expression: string;
};

export const ST_ERRORS = {
  format: new StError('Wrong format of input template'),
  fillout: new StError('Expression contained unresolvable expressions'),
  data: new StError('Wrong data in the context'),
};

/**
 * Provides methods that help with evaluation but do not fit into ST itself.
 */
export class Helper {
  /**
   * Checks whether the given string is a template ( {{ expression }} ).
   *
   * @param {string} str String to check
   */
  static isTemplate(str: string): boolean {
    const re = /\{\{(.+)\}\}/g;
    return re.test(str);
  }
  /**
   * Checks whether the given object is an array.
   *
   * @param {object} item Object to check
   */
  static isArray(item: object | DataObject): boolean {
    return (
      Array.isArray(item) ||
      (!!item &&
        typeof item === 'object' &&
        typeof (item as Array<any>).length === 'number' &&
        ((item as Array<any>).length === 0 ||
          ((item as Array<any>).length > 0 &&
            (item as Array<any>).length - 1 in item)))
    );
  }
  /**
   * Takes any object, finds subtree based on given path and sets the object's
   * value to new_val. The object is returned.
   *
   * @param {DataObject} o
   * @param {string} path
   * @param {any} newVal
   */
  static resolve(o: DataObject, path: string, newVal: any): DataObject {
    if (path && path.length > 0) {
      const func = Function(
        'new_val',
        `with(this) {this${path}=new_val; return this;}`,
      ).bind(o);
      return func(newVal);
    }

    o = newVal;
    return o;
  }

  /**
   * Accepts the given string and transforms it into function name and expression.
   * Output: { name: FUNCTION_NAME:STRING, expression: FUNCTION_EXPRESSION:STRING }
   *
   * @param {string} str String to tokenize.
   */
  static tokenize(str: string): Tokens {
    const re = /\{\{(.+)\}\}/g;
    str = str.replace(re, '$1');
    // str : '#each $jason.items'
    const tokens = str.trim().split(' ');
    // => tokens: ['#each', '$jason.items']
    let func;
    if (tokens.length > 0) {
      if (tokens[0][0] !== '#') {
        const error = ST_ERRORS.format;
        error.message += ' - Does not start with "#".';
        throw error;
      }
      func = tokens.shift();
      // => func: '#each' or '#if'
      // => tokens: ['$jason.items', '&&', '$jason.items.length', '>', '0']
      const expression = tokens.join(' ');
      // => expression: '$jason.items && $jason.items.length > 0'
      return { name: func, expression };
    }
    const err = ST_ERRORS.format;
    err.message += ' - No tokens.';
    throw err;
  }

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
  static fillout(
    template: string,
    data: DataObject,
    raw: boolean,
    keepTemplate: boolean = false,
  ): string {
    // 1. fill out if possible
    // 2. otherwise return the original
    // Run fillout() only if it's a template. Otherwise just return the original string
    if (!Helper.isTemplate(template)) return template;
    const re = /\{\{(.*?)\}\}/g;
    // variables are all instances of {{ }} in the current expression
    // for example '{{this.item}} is {{this.user}}'s' has two variables: ['this.item', 'this.user']
    const variables = template.match(re);
    if (!variables) return template;
    if (raw) return Helper._fillout(null, variables[0], data, keepTemplate);
    // Fill out the template for each variable
    for (const variable of variables) {
      template = Helper._fillout(template, variable, data, keepTemplate);
    }
    return template;
  }

  static _fillout(
    template: string,
    variable: string,
    data: DataObject,
    keepTemplate: boolean = false,
  ): string {
    // Given a template and fill it out with passed slot and its corresponding data
    const re = /\{\{(.*?)\}\}/g;
    const fullRe = /^\{\{((?!\}\}).)*\}\}$/;
    try {
      // 1. Evaluate the variable
      const slot = variable.replace(re, '$1');
      // data must exist. Otherwise replace with blank
      if (data) {
        let func: Function;
        // TODO: Do we need this?
        // // Attach $root to each node so that we can reference it from anywhere
        // const dataType = typeof data;
        // if (['number', 'string', 'array', 'boolean', 'function'].indexOf(dataType === -1)) {
        //     data.$root = root;
        // }
        // If the pattern ends with a return statement, but is NOT wrapped
        // inside another function ([^}]*$), it's a function expression
        const match = /function\([ ]*\)[ ]*\{(.*)\}[ ]*$/g.exec(slot);
        if (match) {
          func = Function(`with(this) {${match[1]}}`).bind(data);
        } else if (
          /\breturn [^;]+;?[ ]*$/.test(slot) &&
          /return[^}]*$/.test(slot)
        ) {
          // Function expression with explicit 'return' expression
          func = Function(`with(this) {${slot}}`).bind(data);
        } else {
          // Function expression with explicit 'return' expression
          // Ordinary simple expression that
          func = Function(`with(this) {return (${slot})}`).bind(data);
        }
        let evaluated = func();

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
          if (!template) return evaluated;
          // if the template is a pure template with no additional static text,
          // And if the evaluated value is an object or an array, we return the
          // object itself instead of replacing it into template via string
          // replace, since that will turn it into a string.
          if (fullRe.test(template)) return evaluated;
          return template.replace(variable, evaluated);
        }
        // Treat false or null as blanks (so that #if can handle it)
        if (!template) return '';
        // if the template is a pure template with no additional static text,
        // And if the evaluated value is an object or an array, we return the
        // object itself instead of replacing it into template via string
        // replace, since that will turn it into a string.
        if (fullRe.test(template)) return evaluated;
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
    } catch (err) {
      if (keepTemplate) return template;

      const e = ST_ERRORS.fillout;
      e.message += ` -- ${err.message}`;
      throw e;
    }
  }
}
