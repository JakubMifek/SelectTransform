import { DataObject, Transform } from '../internal';

export interface KeyExecutor {
  getName(): string;
  fits(template: string): boolean;
  executeSync(
    template: DataObject,
    data: DataObject,
    ts: Transform,
    key: string,
    result: DataObject,
  ): DataObject;
  execute(
    template: DataObject,
    data: DataObject,
    ts: Transform,
    key: string,
    result: DataObject,
  ): Promise<DataObject>;
}
