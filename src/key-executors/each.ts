import { Helper, ST_ERRORS } from '../common';
import { KeyExecutor } from './key-executor';
import { DataObject, Transform } from '../transform';

export class Each implements KeyExecutor {
  private name: string;
  constructor() {
    this.name = Each.name;
  }

  getName(): string {
    return this.name;
  }

  fits(template: string): boolean {
    return (
      typeof template === 'string' &&
      /^\s*\{\{\s*#each\s*[^\s]+\s*\}\}\s*$/g.test(template.toLowerCase())
    );
  }

  async execute(
    template: DataObject,
    data: DataObject,
    ts: Transform,
    key: string,
    result: DataObject,
  ): Promise<DataObject> {
    const fun = Helper.tokenize(key);

    // newData will be filled with parsed results
    const dataArray = Helper.fillout('{{' + fun.expression + '}}', data, true);

    // Ideally newData should be an array since it was prefixed by #each
    if (!dataArray || !Helper.isArray(dataArray)) {
      const err = ST_ERRORS.data;
      err.message += ` - Wrong ${
        Each.name
      } data - expected an array as the iterator.`;
      throw err;
    }

    const promises = [];
    const d = JSON.parse(JSON.stringify(dataArray)); // TODO: something more efficient?
    for (let index = 0; index < dataArray.length; index++) {
      const i = index;
      promises.push(
        // tslint:disable-next-line: ter-arrow-parens
        new Promise(async res => {
          const t = ts.copy();

          // temporarily set $index and $this
          if (typeof d[i] === 'object') {
            d[i]['$index'] = i;
            d[i]['$this'] = d[i];

            // Copy in the memory
            for (const k in t.memory) {
              // Only if we do not override anything
              if (d[i][k] === undefined) {
                d[i][k] = t.memory[k];
              }
            }
          }

          // run
          const loopItem = await t.run(template[key], d[i]);

          // clean up $index and $this
          if (typeof d[i] === 'object') {
            delete d[i]['$index'];
            delete d[i]['$this'];

            // Copy in the memory
            // tslint:disable-next-line: forin
            for (const k in t.memory) {
              // Delete what we added
              delete d[i][k];
            }
          }

          res(loopItem);
        }),
      );
    }

    return await Promise.all(promises);
  }

  executeSync(
    template: DataObject,
    data: DataObject,
    ts: Transform,
    key: string,
    result: DataObject,
  ): DataObject {
    const fun = Helper.tokenize(key);

    // newData will be filled with parsed results
    const dataArray = Helper.fillout('{{' + fun.expression + '}}', data, true);

    // Ideally newData should be an array since it was prefixed by #each
    if (!dataArray || !Helper.isArray(dataArray)) {
      const err = ST_ERRORS.data;
      err.message += ` - Wrong ${
        Each.name
      } data - expected an array as the iterator.`;
      throw err;
    }

    result = [];
    for (let index = 0; index < dataArray.length; index++) {
      // temporarily set $index and $this
      if (typeof dataArray[index] === 'object') {
        dataArray[index]['$index'] = index;
        dataArray[index]['$this'] = dataArray[index];

        // Copy in the memory
        for (const k in ts.memory) {
          // Only if we do not override anything
          if (dataArray[index][k] === undefined) {
            dataArray[index][k] = ts.memory[k];
          }
        }
      } else {
        (String.prototype as any).$index = index;
        (String.prototype as any).$this = dataArray[index];
        (Number.prototype as any).$index = index;
        (Number.prototype as any).$this = dataArray[index];
        (Function.prototype as any).$index = index;
        (Function.prototype as any).$this = dataArray[index];
        (Array.prototype as any).$index = index;
        (Array.prototype as any).$this = dataArray[index];
        (Boolean.prototype as any).$index = index;
        (Boolean.prototype as any).$this = dataArray[index];
      }

      // run
      const loopItem = ts.runSync(template[key], dataArray[index]);

      // clean up $index and $this
      if (typeof dataArray[index] === 'object') {
        delete dataArray[index]['$index'];
        delete dataArray[index]['$this'];

        // Copy in the memory
        // tslint:disable-next-line: forin
        for (const k in ts.memory) {
          // Delete what we added
          delete dataArray[index][k];
        }
      } else {
        delete (String.prototype as any).$index;
        delete (String.prototype as any).$this;
        delete (Number.prototype as any).$index;
        delete (Number.prototype as any).$this;
        delete (Function.prototype as any).$index;
        delete (Function.prototype as any).$this;
        delete (Array.prototype as any).$index;
        delete (Array.prototype as any).$this;
        delete (Boolean.prototype as any).$index;
        delete (Boolean.prototype as any).$this;
      }

      if (loopItem !== undefined && loopItem !== null) {
        // only push when the result is not null nor undefined
        // null could mean #if clauses where nothing matched => In this case
        // instead of rendering 'null', should just skip it completely
        (result as Array<any>).push(loopItem);
      }
    }

    return result;
  }
}
