import { DataObject, Helper, ST_ERRORS, Transform } from '../internal';
import { KeyExecutor } from './key-executor';

export class Concat implements KeyExecutor {
  private name: string;
  constructor() {
    this.name = Concat.name;
  }

  getName(): string {
    return this.name;
  }

  fits(template: string): boolean {
    return (
      typeof template === 'string' &&
      /^\s*\{\{\s*#concat\s*\}\}\s*$/g.test(template.toLowerCase())
    );
  }

  executeSync(
    template: DataObject,
    data: DataObject,
    ts: Transform,
    key: string,
    result: DataObject,
  ): DataObject {
    if (!Helper.isArray(template[key])) {
      const err = ST_ERRORS.format;
      err.message += ` - Wrong ${Concat.name} format - expected an array as the value.`;
      throw err;
    }

    result = [];
    for (const item of template[key]) {
      result = (result as Array<any>).concat(ts.runSync(item, data));
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
    if (!Helper.isArray(template[key])) {
      const err = ST_ERRORS.format;
      err.message += ` - Wrong ${Concat.name} format - expected an array as the value.`;
      throw err;
    }

    const promises = [];
    for (const item of template[key]) {
      promises.push(ts.run(item, data));
    }
    return await Promise.all(promises);
  }
}
