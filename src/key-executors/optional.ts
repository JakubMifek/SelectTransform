import { Helper } from '../common';
import { KeyExecutor } from './key-executor';
import { DataObject, Transform } from '../transform';

export class Optional implements KeyExecutor {
  private name: string;
  constructor() {
    this.name = Optional.name;
  }

  getName() {
    return this.name;
  }

  fits(template: string): boolean {
    return (
      typeof template === 'string' &&
      /^\s*\{\{\s*#optional\s+[^\s]+\s*\}\}\s*$/g.test(template.toLowerCase())
    );
  }

  executeSync(
    template: DataObject,
    data: DataObject,
    ts: Transform,
    key: string,
    result: DataObject,
  ): DataObject {
    const fun = Helper.tokenize(key);
    // Resolve the value
    const ret: DataObject = ts.runSync(template[key], data);

    // If value does not fit conditions
    if (
      !ret ||
      ret === null ||
      ret === undefined ||
      (typeof ret === 'object' && Object.keys(ret).length === 0) ||
      (Helper.isArray(ret as object) && (ret as Array<any>).length === 0)
    ) {
      // We want to ignore these cases
    } else {
      // Otw, include it into the result
      result[fun.expression] = ret;
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
    const fun = Helper.tokenize(key);
    // Resolve the value
    const ret: DataObject = await ts.run(template[key], data);

    // If value does not fit conditions
    if (
      !ret ||
      ret === null ||
      ret === undefined ||
      (typeof ret === 'object' && Object.keys(ret).length === 0) ||
      (Helper.isArray(ret as object) && (ret as Array<any>).length === 0)
    ) {
      // We want to ignore these cases
    } else {
      // Otw, include it into the result
      result[fun.expression] = ret;
    }

    return result;
  }
}
