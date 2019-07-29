import { Helper, ST_ERRORS } from '../common';
import { KeyExecutor } from './key-executor';
import { DataObject, Transform, AnyObject } from '../transform';

export class For implements KeyExecutor {
  private name: string;
  constructor() {
    this.name = For.name;
  }

  getName(): string {
    return this.name;
  }

  fits(template: string): boolean {
    return (
      typeof template === 'string' &&
      /^\s*\{\{\s*#for\s+.+\s*\}\}\s*$/g.test(template.toLowerCase())
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
    if (!dataArray) {
      const err = ST_ERRORS.data;
      err.message += ` - Wrong ${
        For.name
      } data - expected an array as the iterator.`;
      throw err;
    }

    const promises = [];
    const d = JSON.parse(JSON.stringify(dataArray)); // TODO: something more efficient?
    for (const k in d) {
      promises.push(
        // tslint:disable-next-line: ter-arrow-parens
        new Promise(async res => {
          const t = ts.copy();

          // temporarily set $index and $this
          if (typeof d[k] === 'object') {
            d[k]['$key'] = k;
            d[k]['$this'] = d[k];
            d[k]['$root'] = data['$root'];

            // Copy in the memory
            for (const k2 in t.memory) {
              // Only if we do not override anything
              if (d[k][k2] === undefined) {
                d[k][k2] = t.memory[k2];
              }
            }
          }

          // run
          const loopItem = await t.run(template[key], d[k]);

          // clean up $index and $this
          if (typeof d[k] === 'object') {
            delete d[k]['$key'];
            delete d[k]['$this'];
            delete d[k]['$root'];

            // Copy in the memory
            // tslint:disable-next-line: forin
            for (const k2 in t.memory) {
              // Delete what we added
              delete d[k][k2];
            }
          }

          const r = {};
          r[k] = loopItem;

          res(r);
        }),
      );
    }

    return Object.assign({}, ...(await Promise.all(promises)));
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
    const dataArray: AnyObject = (Helper.fillout(
      '{{' + fun.expression + '}}',
      data,
      true,
    ) as unknown) as AnyObject;

    // Ideally newData should be an array since it was prefixed by #each
    if (!dataArray) {
      const err = ST_ERRORS.data;
      err.message += ` - Wrong ${
        For.name
      } data - expected an array as the iterator.`;
      throw err;
    }

    result = [];
    for (const k in dataArray) {
      // temporarily set $index and $this
      if (typeof dataArray[k] === 'object') {
        dataArray[k]['$key'] = k;
        dataArray[k]['$this'] = dataArray[k];
        dataArray[k]['$root'] = data['$root'];

        // Copy in the memory
        for (const k2 in ts.memory) {
          // Only if we do not override anything
          if (dataArray[k][k2] === undefined) {
            dataArray[k][k2] = ts.memory[k2];
          }
        }
      } else {
        (String.prototype as any).$key = k;
        (String.prototype as any).$this = dataArray[k];
        (Number.prototype as any).$key = k;
        (Number.prototype as any).$this = dataArray[k];
        (Function.prototype as any).$key = k;
        (Function.prototype as any).$this = dataArray[k];
        (Array.prototype as any).$key = k;
        (Array.prototype as any).$this = dataArray[k];
        (Boolean.prototype as any).$key = k;
        (Boolean.prototype as any).$this = dataArray[k];
      }

      // run
      const loopItem = ts.runSync(template[key], dataArray[k]);

      // clean up $key and $this
      if (typeof dataArray[k] === 'object') {
        delete dataArray[k]['$key'];
        delete dataArray[k]['$this'];
        delete dataArray[k]['$root'];

        // Copy in the memory
        // tslint:disable-next-line: forin
        for (const k2 in ts.memory) {
          // Delete what we added
          delete dataArray[k][k2];
        }
      } else {
        delete (String.prototype as any).$key;
        delete (String.prototype as any).$this;
        delete (Number.prototype as any).$key;
        delete (Number.prototype as any).$this;
        delete (Function.prototype as any).$key;
        delete (Function.prototype as any).$this;
        delete (Array.prototype as any).$key;
        delete (Array.prototype as any).$this;
        delete (Boolean.prototype as any).$key;
        delete (Boolean.prototype as any).$this;
      }

      result[k] = loopItem;
    }

    return result;
  }
}
