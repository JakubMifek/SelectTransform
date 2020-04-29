import { DataObject, Helper, Transform } from '../internal';
import { ValueExecutor } from './value-executor';

export class Ternary implements ValueExecutor {
  private name: string;

  constructor() {
    this.name = Ternary.name;
  }

  getName(): string {
    return this.name;
  }

  fits(template: string): boolean {
    return (
      typeof template === 'string' &&
      /^\s*\{\{\s*#\?\s+[^\s]+\s*\}\}\s*$/g.test(template.toLowerCase())
    );
  }

  executeSync(template: string, data: DataObject, ts: Transform): DataObject {
    const fun = Helper.tokenize(template);
    const filled = Helper.fillout(`{{${fun.expression}}}`, data, false, true);
    if (!filled || filled === `{{${fun.expression}}}`) {
      // case 1.
      // not parsed, which means the evaluation failed.
      // case 2.
      // returns fasly value
      // both cases mean this key should be excluded
    } else {
      // only include if the evaluation is truthy
      return filled;
    }
    return undefined;
  }

  async execute(
    template: string,
    data: DataObject,
    ts: Transform,
  ): Promise<DataObject> {
    const fun = Helper.tokenize(template);
    const filled = Helper.fillout(`{{${fun.expression}}}`, data, false, true);
    if (!filled || filled === `{{${fun.expression}}}`) {
      // case 1.
      // not parsed, which means the evaluation failed.
      // case 2.
      // returns fasly value
      // both cases mean this key should be excluded
    } else {
      // only include if the evaluation is truthy
      return filled;
    }
    return undefined;
  }
}
