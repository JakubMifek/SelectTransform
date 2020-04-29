import { DataObject, Helper, Transform } from '../internal';
import { ValueExecutor } from './value-executor';

export class Template implements ValueExecutor {
  private name: string;
  constructor() {
    this.name = Template.name;
  }

  getName() {
    return this.name;
  }

  fits(template: string): boolean {
    return (
      typeof template === 'string' &&
      /^\s*\{\{\s*#template\s+[^\s]+\s*\}\}\s*$/g.test(template.toLowerCase())
    );
  }

  executeSync(template: string, data: DataObject, ts: Transform): DataObject {
    const fun = Helper.tokenize(template);
    // insert one of stored templates
    const ptemplate = ts.st.getTemplate(fun.expression);
    return ts.runSync(ptemplate, data);
  }

  async execute(
    template: string,
    data: DataObject,
    ts: Transform,
  ): Promise<DataObject> {
    const fun = Helper.tokenize(template);
    // insert one of stored templates
    const ptemplate = ts.st.getTemplate(fun.expression);
    return await ts.run(ptemplate, data);
  }
}
