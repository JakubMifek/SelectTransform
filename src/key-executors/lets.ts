import {
  AnyObject,
  DataObject,
  Helper,
  ST_ERRORS,
  Transform,
} from '../internal';
import { KeyExecutor } from './key-executor';

export class Lets implements KeyExecutor {
  private name: string;
  constructor() {
    this.name = Lets.name;
  }

  getName() {
    return this.name;
  }

  fits(template: string): boolean {
    return (
      typeof template === 'string' &&
      /^\s*\{\{\s*#lets\s*\}\}\s*$/g.test(template.toLowerCase())
    );
  }

  executeSync(
    template: DataObject,
    data: DataObject,
    ts: Transform,
    key: string,
    result: DataObject,
  ): DataObject {
    result = {};

    // Check the format
    if (!Helper.isArray(template[key]) || template[key].length !== 2) {
      const err = ST_ERRORS.format;
      err.message += ` - Wrong ${Lets.name} format - expected an array with two elements.`;
      throw err;
    }

    const defs: Array<any> = template[key][0];
    const realTemplate = template[key][1];

    // 1. Parse the first item to assign variables
    const originals: AnyObject = {};
    const memory: AnyObject = {};

    // tslint:disable-next-line: forin
    for (const k in defs) {
      const parsed: DataObject = ts.runSync(defs[k], data);

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
    for (const k in defs) {
      // load old (deletes automatically)
      data[k] = originals[k];
      ts.memory[k] = memory[k];
    }

    return result;
  }

  async execute(
    template: string,
    data: DataObject,
    ts: Transform,
    key: string,
    result: DataObject,
  ): Promise<DataObject> {
    result = {};

    // Check the format
    if (!Helper.isArray(template[key]) || template[key].length !== 2) {
      const err = ST_ERRORS.format;
      err.message += ` - Wrong ${Lets.name} format - expected an array with two elements.`;
      throw err;
    }

    const defs = template[key][0];
    const realTemplate = template[key][1];

    // 1. Parse the first item to assign variables
    const originals: AnyObject = {};
    const memory: AnyObject = {};

    // tslint:disable-next-line: forin
    for (const k in defs) {
      const parsed = await ts.run(defs[k], data);

      // 2. modify the data
      // save old
      originals[k] = data[k];
      memory[k] = ts.memory[k];

      // set new
      data[k] = parsed;
      ts.memory[k] = parsed;
    }

    // 3. Pass it into TRANSFORM.run
    result = await ts.run(realTemplate, data);

    // 4. Remove the data from memory
    // tslint:disable-next-line: forin
    for (const k in defs) {
      // load old (deletes automatically)
      data[k] = originals[k];
      ts.memory[k] = memory[k];
    }

    return result;
  }
}
