import { DataObject, Helper, Transform } from '../internal';
import { ValueExecutor } from './value-executor';

export class Include implements ValueExecutor {
  private name: string;

  constructor() {
    this.name = Include.name;
  }

  getName(): string {
    return this.name;
  }

  fits(template: string): boolean {
    return (
      typeof template === 'string' &&
      /^\s*\{\{\s*#include\s+[^\s]+\s*\}\}\s*$/g.test(template.toLowerCase())
    );
  }

  executeSync(template: string, data: DataObject, ts: Transform): DataObject {
    const fun = Helper.tokenize(template);
    if (fun.expression) {
      // if #include has arguments, evaluate it before attaching
      return Helper.fillout(`{{${fun.expression}}`, data, true);
    }

    // shouldn't happen =>
    // {'wrapper': '{{#include}}'}
    return template;
  }

  async execute(
    template: string,
    data: DataObject,
    ts: Transform,
  ): Promise<DataObject> {
    const fun = Helper.tokenize(template);
    if (fun.expression) {
      // if #include has arguments, evaluate it before attaching
      return Helper.fillout(`{{${fun.expression}}`, data, true);
    }

    // shouldn't happen =>
    // {'wrapper': '{{#include}}'}
    return template;
  }
}
