import { DataObject, Transform } from '../internal';

export interface ArrayExecutor {
  getName(): string;
  fits(template: Array<any>): boolean;
  executeSync(
    template: Array<any>,
    data: DataObject,
    ts: Transform,
  ): DataObject;
  execute(
    template: Array<any>,
    data: DataObject,
    ts: Transform,
  ): Promise<DataObject>;
}
