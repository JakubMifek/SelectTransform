import { DataObject, Helper, Transform } from '../internal';
import { KeyExecutor } from './key-executor';

export class Flatten implements KeyExecutor {
  private name: string;
  constructor() {
    this.name = Flatten.name;
  }

  getName(): string {
    return this.name;
  }

  fits(template: string): boolean {
    return (
      typeof template === 'string' &&
      /^\s*\{\{\s*#flatten\s*\}\}\s*$/g.test(template.toLowerCase())
    );
  }

  executeSync(
    template: DataObject,
    data: DataObject,
    ts: Transform,
    key: string,
    result: DataObject,
  ): DataObject {
    const obj: DataObject = ts.runSync(template[key], data);
    result = [];

    if (Helper.isArray(obj)) {
      const arr = obj as Array<any>;
      // For each item in the array
      for (let i = 0; i < arr.length; i++) {
        if (Helper.isArray(arr[i])) {
          // If array then flatten
          for (let j = 0; j < arr[i].length; j++) {
            (result as Array<any>).push(arr[i][j]);
          }
        } else {
          // Just push if anything else
          (result as Array<any>).push(arr[i]);
        }
      }
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
    const obj = await ts.run(template[key], data);
    result = [];

    if (Helper.isArray(obj)) {
      const arr = obj as Array<any>;
      // For each item in the array
      for (let i = 0; i < arr.length; i++) {
        if (Helper.isArray(arr[i])) {
          // If array then flatten
          for (let j = 0; j < arr[i].length; j++) {
            (result as Array<any>).push(arr[i][j]);
          }
        } else {
          // Just push if anything else
          (result as Array<any>).push(arr[i]);
        }
      }
    }
    return result;
  }
}
