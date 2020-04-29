import { DataObject, Helper, ST_ERRORS, Transform } from '../internal';
import { KeyExecutor } from './key-executor';

export class Merge implements KeyExecutor {
  private name: string;
  constructor() {
    this.name = Merge.name;
  }

  getName(): string {
    return this.name;
  }

  fits(template: string): boolean {
    return (
      typeof template === 'string' &&
      /^\s*\{\{\s*#merge\s*\}\}\s*$/g.test(template.toLowerCase())
    );
  }

  executeSync(
    template: DataObject,
    data: DataObject,
    ts: Transform,
    key: string,
    result: DataObject,
  ) {
    if (!Helper.isArray(template[key])) {
      const err = ST_ERRORS.format;
      err.message += ` - Wrong ${Merge.name} format - expected an array as the value.`;
      throw err;
    }

    // Merge all sub-objects
    result = {};
    for (const item of template[key]) {
      Object.assign(result, ts.runSync(item, data));
    }

    // clean up $index from the result
    // necessary because #merge merges multiple objects into one,
    // and one of them may be 'this', in which case the $index attribute
    // will have snuck into the final result
    if (typeof data === 'object') {
      delete result['$index'];
    } else {
      delete (String.prototype as any).$index;
      delete (Number.prototype as any).$index;
      delete (Function.prototype as any).$index;
      delete (Array.prototype as any).$index;
      delete (Boolean.prototype as any).$index;
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
      err.message += ` - Wrong ${Merge.name} format - expected an array as the value.`;
      throw err;
    }

    // Merge all sub-objects
    result = {};
    const promises = [];
    for (const item of template[key]) {
      promises.push(ts.run(item, data));
    }
    Object.assign(result, ...(await Promise.all(promises)));

    // clean up $index from the result
    // necessary because #merge merges multiple objects into one,
    // and one of them may be 'this', in which case the $index attribute
    // will have snuck into the final result
    if (typeof data === 'object') {
      delete result['$index'];
    }

    return result;
  }
}
