import { DataObject, Transform } from '../transform';

export interface ValueExecutor {
  getName(): string;
  fits(template: string): boolean;
  executeSync(template: string, data: DataObject, ts: Transform): DataObject;
  execute(
    template: string,
    data: DataObject,
    ts: Transform,
  ): Promise<DataObject>;
}
