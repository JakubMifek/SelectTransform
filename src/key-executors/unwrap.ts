import { Helper, ST_ERRORS } from '../common';
import { KeyExecutor } from './key-executor';
import { DataObject, Transform } from '../transform';

export class Unwrap implements KeyExecutor {
  private name: string;
  constructor() {
    this.name = Unwrap.name;
  }

  getName(): string {
    return this.name;
  }

  fits(template: string): boolean {
    return (
      typeof template === 'string' &&
      /^\s*\{\{\s*#unwrap\s*[^\s]*\s*\}\}\s*$/g.test(template.toLowerCase())
    );
  }

  executeSync(
    template: DataObject,
    data: DataObject,
    ts: Transform,
    key: string,
    result: DataObject,
  ): DataObject {
    if (typeof template[key] !== 'object') {
      const err = ST_ERRORS.format;
      err.message += ` - Wrong ${Unwrap.name} format - expected an object as the value.`;
      throw err;
    }

    const fun = Helper.tokenize(key);

    const config = template[key];
    const exclude = config.exclude || [];
    const attach = ts.runSync(config.attach || {}, data) as object;

    result = fun.expression !== '' ? data[fun.expression] : data;

    for (const k of exclude) {
      delete result[k];
    }

    // tslint:disable-next-line: forin
    for (const k in attach) {
      result[k] = attach[k];
    }

    return result;
  }

  async execute(
    template: DataObject,
    data: DataObject,
    ts: Transform,
    key: string,
    result: DataObject,
  ): Promise<DataObject> {
    if (typeof template[key] !== 'object') {
      const err = ST_ERRORS.format;
      err.message += ` - Wrong ${Unwrap.name} format - expected an object as the value.`;
      throw err;
    }

    const fun = Helper.tokenize(key);

    const config = template[key];
    const exclude = config.exclude || [];
    const attach = (await ts.run(config.attach || {}, data)) as object;

    result = fun.expression !== '' ? data[fun.expression] : data;

    for (const k of exclude) {
      delete result[k];
    }

    // tslint:disable-next-line: forin
    for (const k in attach) {
      result[k] = attach[k];
    }

    return result;
  }
}
